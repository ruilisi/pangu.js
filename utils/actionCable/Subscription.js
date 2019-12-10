export default class Subscription {
  constructor(consumer, params = {}, mixin = null) {
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

  initialized = () => console.info(`initialized: ${this.identifier}`)

  rejected = () => console.info(`rejected: ${this.identifier}`)

  unsubscribe = () => this.consumer.subscriptions.remove(this)
}
