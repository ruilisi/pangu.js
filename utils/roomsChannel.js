import authedActionCable from './authedActionCable'
import { roomsMessagesSet, roomsMessagesAdd } from '../redux/modules/rooms'
import { viewSetIn } from '../redux/modules/view'

let prevRoomChannel

export default roomId => {
  const cable = authedActionCable()
  if (!cable) return null

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
            DISPATCH(viewSetIn(['avatars'], data.avatars))
            // scrollToBottom()
            break
          case 'add_message':
            DISPATCH(roomsMessagesAdd(data.room_id, data.message))
            // scrollToBottom()
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
  prevRoomChannel = channel
  return prevRoomChannel
}
