/* eslint-disable max-classes-per-file */
import Subscriptions from './Subscriptions'

const bind = (fn, me) => {
  return (...args) => {
    return fn.apply(me, args)
  }
}

const INTERNAL = {
  message_types: {
    welcome: 'welcome',
    disconnect: 'disconnect',
    ping: 'ping',
    confirmation: 'confirm_subscription',
    rejection: 'reject_subscription'
  },
  disconnect_reasons: {
    unauthorized: 'unauthorized',
    invalid_request: 'invalid_request',
    server_restart: 'server_restart'
  },
  default_mount_path: '/cable',
  protocols: ['actioncable-v1-json', 'actioncable-unsupported']
}

const ActionCable = {
  INTERNAL,
  createConsumer: (url, jwtToken = null) => {
    let _url
    if (url == null) {
      const configUrl = ActionCable.getConfig('url')
      if (configUrl === null) {
        _url = INTERNAL.default_mount_path
      } else {
        _url = configUrl
      }
    } else {
      _url = url
    }
    if (jwtToken) {
      ActionCable.INTERNAL.protocols.push(jwtToken)
    }
    // eslint-disable-next-line no-use-before-define
    return new ActionCableConsumer(ActionCable.createWebSocketURL(_url))
  },

  getConfig: name => {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`)
    return element != null ? element.getAttribute('content') : void 0
  },

  createWebSocketURL: url => {
    let a
    if (url && !/^wss?:/i.test(url)) {
      a = document.createElement('a')
      a.href = url
      a.protocol = a.protocol.replace('http', 'ws')
      return a.href
    }
    return url
  },
  startDebugging: () => {
    ActionCable.debugging = true
    return ActionCable.debugging
  },
  stopDebugging: () => {
    ActionCable.debugging = null
    return ActionCable.debugging
  },
  log: (...args) => {
    if (ActionCable.debugging) {
      const ref = console
      args.push(Date.now())
      return ref.log.apply(ref, ['[ActionCable]', ...args])
    }
    return null
  }
}

class ActionCableConnectionMonitor {
  static pollInterval = {
    min: 3,
    max: 30
  }

  static staleThreshold = 6

  constructor(connection) {
    this.connection = connection
    this.visibilityDidChange = bind(this.visibilityDidChange, this)
    this.reconnectAttempts = 0
  }

  start = () => {
    if (!this.isRunning()) {
      this.startedAt = this.now()
      delete this.stoppedAt
      this.startPolling()
      document.addEventListener('visibilitychange', this.visibilityDidChange)
      return ActionCable.log(`ConnectionMonitor started. pollInterval = ${this.getPollInterval()} ms`)
    }
    return null
  }

  stop = () => {
    if (this.isRunning()) {
      this.stoppedAt = this.now()
      this.stopPolling()
      document.removeEventListener('visibilitychange', this.visibilityDidChange)
      return ActionCable.log('ConnectionMonitor stopped')
    }
    return null
  }

  isRunning = () => this.startedAt != null && this.stoppedAt == null

  recordPing = () => {
    this.pingedAt = this.now()
  }

  recordConnect = () => {
    this.reconnectAttempts = 0
    this.recordPing()
    delete this.disconnectedAt
    return ActionCable.log('ConnectionMonitor recorded connect')
  }

  recordDisconnect = () => {
    this.disconnectedAt = this.now()
    return ActionCable.log('ConnectionMonitor recorded disconnect')
  }

  startPolling = () => {
    this.stopPolling()
    return this.poll()
  }

  stopPolling = () => clearTimeout(this.pollTimeout)

  poll = () => {
    this.pollTimeout = setTimeout(
      (_this => () => {
        _this.reconnectIfStale()
        return _this.poll()
      })(this),
      this.getPollInterval()
    )
    return this.pollTimeout
  }

  getPollInterval = () => {
    const { min, max } = ActionCableConnectionMonitor.pollInterval
    const interval = 5 * Math.log(this.reconnectAttempts + 1)
    return Math.round(this.clamp(interval, min, max) * 1000)
  }

  reconnectIfStale = () => {
    if (this.connectionIsStale()) {
      ActionCable.log(
        `ConnectionMonitor detected stale connection. reconnectAttempts = ${
          this.reconnectAttempts
        }, pollInterval = ${this.getPollInterval()} ms, time disconnected = ${this.secondsSince(this.disconnectedAt)} s, stale threshold = ${
          ActionCableConnectionMonitor.staleThreshold
        } s`
      )
      this.reconnectAttempts += 1
      if (this.disconnectedRecently()) {
        return ActionCable.log('ConnectionMonitor skipping reopening recent disconnect')
      }
      ActionCable.log('ConnectionMonitor reopening')
      return this.connection.reopen()
    }
    return null
  }

  connectionIsStale = () => this.secondsSince(this.pingedAt != null ? this.pingedAt : this.startedAt) > ActionCableConnectionMonitor.staleThreshold

  disconnectedRecently = () => this.disconnectedAt && this.secondsSince(this.disconnectedAt) < ActionCableConnectionMonitor.staleThreshold

  visibilityDidChange = () => {
    if (document.visibilityState === 'visible') {
      return setTimeout(
        (_this => () => {
          if (_this.connectionIsStale() || !_this.connection.isOpen()) {
            ActionCable.log(`ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = ${document.visibilityState}`)
            return _this.connection.reopen()
          }
          return null
        })(this),
        200
      )
    }
    return null
  }

  now = () => new Date().getTime()

  secondsSince = time => (this.now() - time) / 1000

  clamp = (number, min, max) => Math.max(min, Math.min(max, number))
}

class ActionCableConnection {
  static reopenDelay = 500

  constructor(consumer) {
    this.consumer = consumer
    this.open = bind(this.open, this)
    this.subscriptions = this.consumer.subscriptions
    this.monitor = new ActionCableConnectionMonitor(this)
    this.disconnected = true
    const { protocols } = INTERNAL
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
    ActionCable.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${INTERNAL.protocols}`)
    if (this.webSocket != null) {
      this.uninstallEventHandlers()
    }
    this.webSocket = new WebSocket(this.consumer.url, INTERNAL.protocols)
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
        ActionCable.log(`Reopening WebSocket in ${ActionCableConnection.reopenDelay}ms`)
        setTimeout(this.open, ActionCableConnection.reopenDelay)
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
      const { identifier, message, type } = JSON.parse(event.data)

      const { message_types } = INTERNAL
      switch (type) {
        case message_types.welcome:
          this.monitor.recordConnect()
          return this.subscriptions.reload()
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
      return ActionCable.log('WebSocket onerror event')
    }
  }
}

class ActionCableConsumer {
  constructor(url) {
    this.url = url
    this.subscriptions = new Subscriptions(this)
    this.connection = new ActionCableConnection(this)
  }

  send = data => this.connection.send(data)

  connect = () => this.connection.open()

  disconnect = () => this.connection.close({ allowReconnect: false })

  ensureActiveConnection = () => {
    if (!this.connection.isActive()) {
      this.connection.open()
    }
  }
}

export default ActionCable
