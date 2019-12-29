import React, { useEffect, useState, useContext } from 'react'
import { createConsumer } from 'actioncable-jwt'
import { getJwtToken } from '../utils/request'

const Context = React.createContext()

const isFunction = functionToCheck => {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

const Provider = ({ children, url }) => {
  const jwtToken = process.browser ? getJwtToken() : null
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

const Consumer = ({ children, channel, onReceived, onInitialized, onConnected, onDisconnected, onRejected, onSubscribed, onUnauthorized }) => {
  const { cable } = useContext(Context)
  const [subscription, setSubscription] = useState(null)
  useEffect(() => {
    if (cable) {
      const [createdSubscription] = cable.subscriptions.findAll(JSON.stringify(channel))
      if (createdSubscription) {
        setSubscription(createdSubscription)
      } else {
        const s = cable.subscriptions.create(channel, {
          received: data => onReceived && onReceived(s, data),
          initialized: () => onInitialized && onInitialized(s),
          connected: () => onConnected && onConnected(s),
          disconnected: () => onDisconnected && onDisconnected(s),
          subscribed: () => onSubscribed && onSubscribed(s),
          rejected: () => onRejected && onRejected(s),
          unauthorized: () => onUnauthorized && onUnauthorized(s)
        })
        setSubscription(s)
      }
    }
  }, [cable, JSON.stringify(channel)])

  if (isFunction(children)) {
    return children({ subscription })
  }
  return children || null
}

export { Context, Provider, Consumer }
