import Subscriptions from './Subscriptions'
import Connection from './Connection'

export default class Consumer {
  constructor(url) {
    this.url = url
    this.subscriptions = new Subscriptions(this)
    this.connection = new Connection(this)
  }

  send = data => this.connection.send(data)

  connect = () => this.connection.open()

  disconnect = () => this.connection.close({ allowReconnect: false })

  ensureActiveConnection = () => {
    if (!this.connection.isActive()) {
      return this.connection.open()
    }
    return null
  }
}
