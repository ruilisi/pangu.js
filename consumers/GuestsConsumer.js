import React from 'react'
import { Consumer } from '../contexts/ActionCableContext'
import { setAuthorized } from '%view'
import { setAuthorization } from '../utils/request'

const GuestsConsumer = ({ children }) => {
  const onReceived = (_, receivedData) => {
    const { data, path } = receivedData
    switch (path) {
      case 'wechat_login':
        setAuthorized(true)
        setAuthorization(data)
        break
      default:
        break
    }
  }

  return (
    <Consumer channel="GuestsChannel" onReceived={onReceived}>
      {children}
    </Consumer>
  )
}

export default GuestsConsumer
