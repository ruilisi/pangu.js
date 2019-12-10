import logger from './logger'

const now = () => new Date().getTime()

export default class ConnectionMonitor {
  static pollInterval = {
    min: 3,
    max: 30,
    multiplier: 5
  }

  static staleThreshold = 6

  constructor(connection) {
    this.connection = connection
    this.visibilityDidChange = this.visibilityDidChange.bind(this)
    this.reconnectAttempts = 0
  }

  start = () => {
    if (!this.isRunning()) {
      this.startedAt = now()
      delete this.stoppedAt
      this.startPolling()
      document.addEventListener('visibilitychange', this.visibilityDidChange)
      logger.log(`ConnectionMonitor started. pollInterval = ${this.getPollInterval()} ms`)
    }
  }

  stop = () => {
    if (this.isRunning()) {
      this.stoppedAt = now()
      this.stopPolling()
      document.removeEventListener('visibilitychange', this.visibilityDidChange)
      logger.log('ConnectionMonitor stopped')
    }
  }

  isRunning = () => this.startedAt && !this.stoppedAt

  recordPing = () => {
    this.pingedAt = now()
  }

  recordConnect = () => {
    this.reconnectAttempts = 0
    this.recordPing()
    delete this.disconnectedAt
    return logger.log('ConnectionMonitor recorded connect')
  }

  recordDisconnect = () => {
    this.disconnectedAt = now()
    return logger.log('ConnectionMonitor recorded disconnect')
  }

  startPolling = () => {
    this.stopPolling()
    this.poll()
  }

  stopPolling = () => clearTimeout(this.pollTimeout)

  poll = () => {
    this.pollTimeout = setTimeout(() => {
      this.reconnectIfStale()
      this.poll()
    }, this.getPollInterval())
  }

  getPollInterval = () => {
    const { min, max, multiplier } = ConnectionMonitor.pollInterval
    const interval = multiplier * Math.log(this.reconnectAttempts + 1)
    return Math.round(this.clamp(interval, min, max) * 1000)
  }

  reconnectIfStale = () => {
    if (this.connectionIsStale()) {
      logger.log(
        `ConnectionMonitor detected stale connection. reconnectAttempts = ${
          this.reconnectAttempts
        }, pollInterval = ${this.getPollInterval()} ms, time disconnected = ${this.secondsSince(this.disconnectedAt)} s, stale threshold = ${
          ConnectionMonitor.staleThreshold
        } s`
      )
      this.reconnectAttempts += 1
      if (this.disconnectedRecently()) {
        logger.log('ConnectionMonitor skipping reopening recent disconnect')
      }
      logger.log('ConnectionMonitor reopening')
      this.connection.reopen()
    }
  }

  connectionIsStale = () => this.secondsSince(this.pingedAt ? this.pingedAt : this.startedAt) > ConnectionMonitor.staleThreshold

  disconnectedRecently = () => this.disconnectedAt && this.secondsSince(this.disconnectedAt) < ConnectionMonitor.staleThreshold

  visibilityDidChange = () => {
    if (document.visibilityState === 'visible') {
      setTimeout(() => {
        if (this.connectionIsStale() || !this.connection.isOpen()) {
          logger.log(`ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = ${document.visibilityState}`)
          this.connection.reopen()
        }
      }, 200)
    }
  }

  secondsSince = time => (now() - time) / 1000

  clamp = (number, min, max) => Math.max(min, Math.min(max, number))
}
