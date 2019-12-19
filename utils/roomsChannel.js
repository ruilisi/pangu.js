import authedActionCable from './authedActionCable'
import { roomsMessagesSet, roomsMessagesAdd } from '../redux/modules/rooms'
import { viewSetIn } from '../redux/modules/view'

let prevRoomChannel
let prevRoomId

export default roomId => {
  const cable = authedActionCable()
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
            DISPATCH(roomsMessagesAdd(data.room_id, data.message))
            break
          case 'join_room':
            DISPATCH(roomsMessagesAdd(data.room_id, data.message))
            DISPATCH(viewSetIn(['timeStamp'], new Date().getTime()))
            break
          case 'lottery':
            DISPATCH(viewSetIn(['lottery'], data.lottery))
            DISPATCH(viewSetIn(['showLottery'], true))
            break
          default:
        }
      },
      load(path, data) {
        console.info(path, data)
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
