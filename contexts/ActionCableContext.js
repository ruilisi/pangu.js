import React, { useEffect, useState, useContext } from 'react'
import { createConsumer } from 'actioncable-jwt'

const Context = React.createContext()

const Provider = ({ children, url, jwtToken }) => {
  const [cable, setCable] = useState(null)

  useEffect(() => {
    if (url && jwtToken) {
      setCable(createConsumer(url, jwtToken))
    }
  }, [url, jwtToken])
  return <Context.Provider value={cable}>{children}</Context.Provider>
}

const Consumer = ({ channel, children, onReceived, onInitialized, onConnected, onDisconnected, onRejected, onSubscribed, onUnauthorized }) => {
  const [subscription, setSubscription] = useState()
  const cable = useContext(Context)
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
  }, [cable, channel])

  if (!subscription || !children) {
    return null
  }
  return children({ subscription })
}

export { Context, Provider, Consumer }
