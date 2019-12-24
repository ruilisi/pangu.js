import { roomsMessagesSet, roomsMessagesAdd, roomsMessagesUpdate, roomsMessagesDelete } from '../redux/modules/rooms'
import { viewSetIn } from '../redux/modules/view'

let prevRoomChannel
let prevRoomId

export default (cable, roomId) => {
  if (!cable) return null

  if (prevRoomId === roomId) return prevRoomChannel

  if (prevRoomChannel) {
    prevRoomChannel.unsubscribe()
    prevRoomChannel = null
  }

  const channel = cable.subscriptions.create(
    { channel: 'RoomsChannel', room_id: roomId },
    {
      connected: () => {
        channel.load('messages', { room_id: roomId })
      },
      subscribed: () => console.info('subscripted'),
      received: data => {
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
      },
      load(path, data) {
        return this.perform('load', {
          path,
          data
        })
      }
    }
  )
  prevRoomId = roomId
  prevRoomChannel = channel
  return prevRoomChannel
}
