import React from 'react'
import { Consumer } from '../contexts/ActionCableContext'
import { setAuthorized } from '%view'
import { selfSet } from '../redux/modules/self'

const UsersConsumer = () => {
  const onConnected = subscription => {
    DISPATCH(setAuthorized(true))
    subscription.perform('load', { path: 'self', data: {} })
  }
  const onUnauthorized = () => {
    DISPATCH(setAuthorized(false))
  }

  const onReceived = (_subscription, receivedData) => {
    const { data, path } = receivedData
    switch (path) {
      case 'self':
        DISPATCH(selfSet(data))
        break
      default:
        break
    }
  }

  return <Consumer channel="UsersChannel" onConnected={onConnected} onUnauthorized={onUnauthorized} onReceived={onReceived} />
}

export default UsersConsumer
