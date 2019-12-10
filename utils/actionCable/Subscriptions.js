import Subscription from './Subscription'
import _typeof from './_typeof'

export default class ActionCableSubscriptions {
  constructor(consumer) {
    this.consumer = consumer
    this.subscriptions = []
  }

  create = (channel, mixin) => {
    const params = ['undefined', 'object'].includes(_typeof(channel)) ? channel : { channel }
    const subscription = new Subscription(this.consumer, params, mixin)
    return this.add(subscription)
  }

  add = subscription => {
    this.subscriptions.push(subscription)
    this.consumer.ensureActiveConnection()
    this.notify(subscription, 'initialized')
    this.sendCommand(subscription, 'subscribe')
    return subscription
  }

  remove = subscription => {
    this.forget(subscription)
    if (!this.findAll(subscription.identifier).length) {
      this.sendCommand(subscription, 'unsubscribe')
    }
    return subscription
  }

  reject = identifier =>
    this.findAll(identifier).map(subscription => {
      this.forget(subscription)
      this.notify(subscription, 'rejected')
      return subscription
    })

  forget = subscription => {
    this.subscriptions = this.subscriptions.filter(s => s !== subscription)
    return subscription
  }

  findAll = identifier => this.subscriptions.filter(subscription => subscription.identifier === identifier)

  reload = () => this.subscriptions.map(subscription => this.sendCommand(subscription, 'subscribe'))

  notifyAll = (callbackName, ...args) => this.subscriptions.map(subscription => this.notify(subscription, callbackName, ...args))

  notify = (subscription, callbackName, ...args) => {
    let subscriptions
    if (typeof subscription === 'string') {
      subscriptions = this.findAll(subscription)
    } else {
      subscriptions = [subscription]
    }
    return subscriptions.map(s => (typeof s[callbackName] === 'function' ? s[callbackName](...args) : undefined))
  }

  sendCommand = (subscription, command) =>
    this.consumer.send({
      command,
      identifier: subscription.identifier
    })
}
