import React from 'react'
import { Consumer } from '../contexts/ActionCableContext'
import { viewSetIn, authorizedPath } from '%view'
import { selfSet } from '../redux/modules/self'

const UsersConsumer = () => {
  const onConnected = subscription => {
    if (STATE().view.getIn(authorizedPath) !== true) {
      DISPATCH(viewSetIn(authorizedPath, true))
    }
    subscription.perform('load', { path: 'self', data: {} })
  }
  const onUnauthorized = () => {
    DISPATCH(viewSetIn(authorizedPath, false))
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
