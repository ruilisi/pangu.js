import React, { useEffect, useState } from 'react'
import { createConsumer } from 'actioncable-jwt'

const Context = React.createContext()

const isFunction = functionToCheck => {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

const Provider = ({ children, url, jwtToken }) => {
  const [cable, setCable] = useState(null)

  const disconnectCable = () => {
    if (cable) cable.disconnect()
  }
  useEffect(() => {
    if (url && jwtToken) {
      disconnectCable()
      setCable(createConsumer(url, jwtToken))
    }
    return disconnectCable
  }, [url, jwtToken])
  return <Context.Provider value={{ cable }}>{children}</Context.Provider>
}

const Controller = ({ children, cable, channel, onReceived, onInitialized, onConnected, onDisconnected, onRejected, onSubscribed, onUnauthorized }) => {
  const [subscription, setSubscription] = useState(null)
  useEffect(() => {
    if (cable && channel) {
      const s = cable.subscriptions.create(channel, {
        received: data => onReceived && onReceived(s, data),
        initialized: () => onInitialized && onInitialized(s),
        connected: () => onConnected && onConnected(s),
        disconnected: () => onDisconnected && onDisconnected(s),
        subscribed: () => onSubscribed && onSubscribed(s),
        rejected: () => onRejected && onRejected(s),
        authorized: () => onUnauthorized && onUnauthorized(s)
      })
      setSubscription(s)
    }
    return () => {
      if (cable && subscription) {
        cable.subscriptions.remove(subscription)
        setSubscription(null)
      }
    }
  }, [cable, channel])

  if (isFunction(children)) {
    return children({ subscription })
  }
  return children || null
}

const Consumer = ({ ...props }) => {
  return <Context.Consumer>{({ cable }) => <Controller cable={cable} {...props} />}</Context.Consumer>
}

export { Context, Provider, Consumer }
