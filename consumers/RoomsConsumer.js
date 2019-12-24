import React from 'react'
import { Consumer } from '../contexts/ActionCableContext'
import { viewSetIn } from '%view'
import { roomsMessagesSet, roomsMessagesAdd, roomsMessagesUpdate, roomsMessagesDelete } from '../redux/modules/rooms'

const RoomsConsumer = ({ roomId, children }) => {
  const onConnected = subscription => {
    subscription.perform('load', { path: 'messages', data: { room_id: roomId } })
  }
  const onReceived = (_subscription, data) => {
    switch (data.path) {
      case 'messages':
        DISPATCH(roomsMessagesSet(data.room_id, data.messages))
        break
      case 'add_message':
        if (data.error) {
          console.info(data.error)
          break
        }
        DISPATCH(roomsMessagesAdd(data.room_id, data.message))
        break
      case 'update_message':
        if (data.error) {
          console.info(data.error)
          break
        }
        DISPATCH(roomsMessagesUpdate(data.room_id, data.message))
        break
      case 'delete_message':
        DISPATCH(roomsMessagesDelete(data.room_id, data.message_id))
        break
      case 'join_room':
        DISPATCH(roomsMessagesAdd(data.room_id, data.message))
        DISPATCH(viewSetIn(['timeStamp'], new Date().getTime()))
        break
      default:
    }
  }

  return (
    <Consumer channel={{ channel: 'RoomsChannel', room_id: roomId }} onConnected={onConnected} onReceived={onReceived}>
      {children}
    </Consumer>
  )
}

export default RoomsConsumer
