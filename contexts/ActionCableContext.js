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

const Consumer = ({ channel, children, onReceived, onInitialized, onConnected, onDisconnected, onRejected, onSubscribed }) => {
  const [subscription, setSubscription] = useState()
  const cable = useContext(Context)
  useEffect(() => {
    if (cable && channel) {
      setSubscription(
        cable.subscriptions.create(channel, {
          received: data => onReceived && onReceived(data),
          initialized: () => onInitialized && onInitialized(),
          connected: () => onConnected && onConnected(),
          disconnected: () => onDisconnected && onDisconnected(),
          subscribed: () => onSubscribed && onSubscribed(),
          rejected: () => onRejected && onRejected()
        })
      )
    }
  }, [cable, channel])

  if (!subscription) {
    return null
  }
  return children({ subscription })
}

export { Context, Provider, Consumer }
