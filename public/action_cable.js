/* eslint-disable max-classes-per-file */

const bind = (fn, me) => {
  return (...args) => {
    return fn.apply(me, args)
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

const INTERNAL = {
  message_types: {
    welcome: 'welcome',
    ping: 'ping',
    confirmation: 'confirm_subscription',
    rejection: 'reject_subscription'
  },
  default_mount_path: '/cable',
  protocols: ['actioncable-v1-json', 'actioncable-unsupported']
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

class ActionCableSubscription {
  constructor(consumer, params, mixin) {
    this.consumer = consumer
    this.identifier = JSON.stringify(params || {})
    Object.assign(this, mixin)
  }

  perform = (action, data = {}) => {
    const _data = data || {}
    _data.action = action
    return this.send(_data)
  }

  send = data =>
    this.consumer.send({
      command: 'message',
      identifier: this.identifier,
      data: JSON.stringify(data)
    })

  unsubscribe = () => this.consumer.subscriptions.remove(this)
}

class ActionCableConsumer {
  constructor(url) {
    this.url = url
    this.subscriptions = new ActionCable.Subscriptions(this)
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

;(function() {
  const context = this

  ;(function() {
    ;(function() {
      const { slice } = []

      this.ActionCable = {
        INTERNAL,
        createConsumer(url, jwt_token = null) {
          let ref
          if (url == null) {
            url = (ref = this.getConfig('url')) != null ? ref : this.INTERNAL.default_mount_path
          }
          if (jwt_token) {
            this.INTERNAL.protocols.push(jwt_token)
          }
          return new ActionCableConsumer(this.createWebSocketURL(url))
        },
        getConfig(name) {
          const element = document.head.querySelector(`meta[name='action-cable-${name}']`)
          return element != null ? element.getAttribute('content') : void 0
        },
        createWebSocketURL(url) {
          let a
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement('a')
            a.href = url
            a.href = a.href
            a.protocol = a.protocol.replace('http', 'ws')
            return a.href
          }
          return url
        },
        startDebugging() {
          return (this.debugging = true)
        },
        stopDebugging() {
          return (this.debugging = null)
        },
        log() {
          let messages
          let ref
          messages = arguments.length >= 1 ? slice.call(arguments, 0) : []
          if (this.debugging) {
            messages.push(Date.now())
            return (ref = console).log.apply(ref, ['[ActionCable]'].concat(slice.call(messages)))
          }
        }
      }
    }.call(this))
  }.call(context))

  const { ActionCable } = context
  ;(function() {
    ;(function() {}.call(this))
    ;(function() {
      const { slice } = []

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer
          this.subscriptions = []
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          let channel
          let params
          let subscription
          channel = channelName
          params =
            typeof channel === 'object'
              ? channel
              : {
                  channel
                }
          subscription = new ActionCableSubscription(this.consumer, params, mixin)
          return this.add(subscription)
        }

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription)
          this.consumer.ensureActiveConnection()
          this.notify(subscription, 'initialized')
          this.sendCommand(subscription, 'subscribe')
          return subscription
        }

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription)
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, 'unsubscribe')
          }
          return subscription
        }

        Subscriptions.prototype.reject = function(identifier) {
          let i
          let len
          let ref
          let results
          let subscription
          ref = this.findAll(identifier)
          results = []
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i]
            this.forget(subscription)
            this.notify(subscription, 'rejected')
            results.push(subscription)
          }
          return results
        }

        Subscriptions.prototype.forget = function(subscription) {
          let s
          this.subscriptions = function() {
            let i
            let len
            let ref
            let results
            ref = this.subscriptions
            results = []
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i]
              if (s !== subscription) {
                results.push(s)
              }
            }
            return results
          }.call(this)
          return subscription
        }

        Subscriptions.prototype.findAll = function(identifier) {
          let i
          let len
          let ref
          let results
          let s
          ref = this.subscriptions
          results = []
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i]
            if (s.identifier === identifier) {
              results.push(s)
            }
          }
          return results
        }

        Subscriptions.prototype.reload = function() {
          let i
          let len
          let ref
          let results
          let subscription
          ref = this.subscriptions
          results = []
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i]
            results.push(this.sendCommand(subscription, 'subscribe'))
          }
          return results
        }

        Subscriptions.prototype.notifyAll = function() {
          let args
          let callbackName
          let i
          let len
          let ref
          let results
          let subscription
          ;(callbackName = arguments[0]), (args = arguments.length >= 2 ? slice.call(arguments, 1) : [])
          ref = this.subscriptions
          results = []
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i]
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))))
          }
          return results
        }

        Subscriptions.prototype.notify = function() {
          let args
          let callbackName
          let i
          let len
          let results
          let subscription
          let subscriptions
          ;(subscription = arguments[0]), (callbackName = arguments[1]), (args = arguments.length >= 3 ? slice.call(arguments, 2) : [])
          if (typeof subscription === 'string') {
            subscriptions = this.findAll(subscription)
          } else {
            subscriptions = [subscription]
          }
          results = []
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i]
            results.push(typeof subscription[callbackName] === 'function' ? subscription[callbackName].apply(subscription, args) : void 0)
          }
          return results
        }

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          let identifier
          identifier = subscription.identifier
          return this.consumer.send({
            command,
            identifier
          })
        }

        return Subscriptions
      })()
    }.call(this))
  }.call(this))

  if (typeof module === 'object' && module.exports) {
    module.exports = ActionCable
  } else if (typeof define === 'function' && define.amd) {
    define(ActionCable)
  }
}.call(this))
