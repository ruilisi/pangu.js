// eslint-disable-next-line import/no-cycle
import ActionCable from './index'
import internal from './internal'
// eslint-disable-next-line import/no-cycle
import ConnectionMonitor from './ConnectionMonitor'

export default class Connection {
  static reopenDelay = 500

  constructor(consumer) {
    this.open = this.open.bind(this)
    this.consumer = consumer
    this.subscriptions = this.consumer.subscriptions
    this.monitor = new ConnectionMonitor(this)
    this.disconnected = true
    const { protocols } = internal
    this.supportedProtocols = protocols.length >= 2 ? protocols.slice(0, -1) : []
    this.unsupportedProtocol = protocols[protocols.length - 1]
  }

  send = data => {
    if (this.isOpen()) {
      this.webSocket.send(JSON.stringify(data))
      return true
    }
    return false
  }

  open = () => {
    if (this.isActive()) {
      ActionCable.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`)
      return false
    }
    ActionCable.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${internal.protocols}`)
    if (this.webSocket) {
      this.uninstallEventHandlers()
    }
    this.webSocket = new WebSocket(this.consumer.url, [...internal.protocols, internal.jwtToken])
    this.installEventHandlers()
    this.monitor.start()
    return true
  }

  close = arg => {
    const allowReconnect = arg != null ? arg.allowReconnect : true
    if (!allowReconnect) {
      this.monitor.stop()
    }
    if (this.isActive() && this.webSocket) {
      this.websocket.close()
    }
  }

  reopen = () => {
    let error
    ActionCable.log(`Reopening WebSocket, current state is ${this.getState()}`)
    if (this.isActive()) {
      try {
        return this.close()
      } catch (error1) {
        error = error1
        return ActionCable.log('Failed to reopen WebSocket', error)
      } finally {
        ActionCable.log(`Reopening WebSocket in ${Connection.reopenDelay}ms`)
        setTimeout(this.open, Connection.reopenDelay)
      }
    } else {
      return this.open()
    }
  }

  getProtocol = () => (this.webSocket != null ? this.webSocket.protocol : void 0)

  isOpen = () => this.isState('open')

  isActive = () => this.isState('open', 'connecting')

  isProtocolSupported = () => this.supportedProtocols.includes(this.getProtocol())

  isState = (...args) => args.indexOf(this.getState()) >= 0

  getState = () => {
    const curState = Object.keys(WebSocket).find(state => this.webSocket != null && this.webSocket.readyState === WebSocket[state])
    return curState && curState.toLowerCase()
  }

  installEventHandlers = () => {
    Object.keys(this.events).forEach(eventName => {
      this.webSocket[`on${eventName}`] = this.events[eventName].bind(this)
    })
  }

  uninstallEventHandlers = () => {
    Object.keys(this.events).forEach(eventName => {
      this.webSocket[`on${eventName}`] = () => {}
    })
  }

  events = {
    message(event) {
      if (!this.isProtocolSupported()) {
        return null
      }
      const { identifier, message, type, reason, reconnect } = JSON.parse(event.data)

      const { message_types } = internal
      switch (type) {
        case message_types.welcome:
          this.monitor.recordConnect()
          return this.subscriptions.reload()
        case message_types.disconnect:
          ActionCable.log(`Disconnecting. Reason: ${reason}`)
          return this.close({
            allowReconnect: reconnect
          })
        case message_types.ping:
          return this.monitor.recordPing()
        case message_types.confirmation:
          return this.subscriptions.notify(identifier, 'connected')
        case message_types.rejection:
          return this.subscriptions.reject(identifier)
        default:
          return this.subscriptions.notify(identifier, 'received', message)
      }
    },
    open() {
      ActionCable.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`)
      this.disconnected = false
      if (!this.isProtocolSupported()) {
        ActionCable.log('Protocol is unsupported. Stopping monitor and disconnecting.')
        return this.close({
          allowReconnect: false
        })
      }
      return null
    },
    close() {
      ActionCable.log('WebSocket onclose event')
      if (this.disconnected) {
        return null
      }
      this.disconnected = true
      this.monitor.recordDisconnect()
      return this.subscriptions.notifyAll('disconnected', {
        willAttemptReconnect: this.monitor.isRunning()
      })
    },
    error() {
      ActionCable.log('WebSocket onerror event')
    }
  }
}
