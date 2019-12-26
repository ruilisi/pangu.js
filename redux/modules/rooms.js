import I, { isImmutable, List, Map } from 'immutable'

export const ROOMS_SET = 'ROOMS_SET'
export const ROOMS_ADD = 'ROOMS_ADD'
export const ROOMS_REMOVE = 'ROOMS_REMOVE'
export const ROOMS_MESSAGES_ADD = 'ROOMS_MESSAGES_ADD'
export const ROOMS_MESSAGES_SET = 'ROOMS_MESSAGES_SET'
export const ROOMS_MESSAGES_UPDATE = 'ROOMS_MESSAGES_UPDATE'
export const ROOMS_MESSAGES_DELETE = 'ROOMS_MESSAGES_DELETE'

const initialState = I.fromJS({})
export default (rooms = initialState, action) => {
  const { id, message } = action
  switch (action.type) {
    case ROOMS_SET:
      return I.fromJS(action.rooms)
    case ROOMS_ADD:
      return rooms.merge(I.fromJS(action.rooms))
    case ROOMS_REMOVE:
      return rooms.remove(I.fromJS(action.rooms))
    case ROOMS_MESSAGES_SET:
      return rooms.setIn([id, 'messages'], I.fromJS(action.messages))
    case ROOMS_MESSAGES_ADD:
      return rooms.updateIn([id, 'messages'], messages => (messages || List()).push(Map(action.message)))
    case ROOMS_MESSAGES_UPDATE:
      // return rooms.setIn(
      // [
      // id,
      // 'messages',
      // rooms.getIn([id, 'messages']).findIndex(listItem => {
      // return listItem.get('id') === action.message.id
      // }),
      // 'text'
      // ],
      // action.message.text
      // ) // 也可以
      return rooms.updateIn([id, 'messages'], messages =>
        messages.set(
          messages.findIndex(item => item.get('id') === message.get('id')),
          message
        )
      )
    case ROOMS_MESSAGES_DELETE:
      return rooms.updateIn([id, 'messages'], messages => {
        return messages.filter(m => m.get('id') !== action.messageId)
      })
    default:
      if (!isImmutable(rooms)) {
        return I.fromJS(rooms)
      }
      return rooms
  }
}

export const roomsSet = rooms => ({ type: ROOMS_SET, rooms })
export const roomsAdd = rooms => ({ type: ROOMS_ADD, rooms })
export const roomsRemove = rooms => ({ type: ROOMS_REMOVE, rooms })
export const roomsMessagesAdd = (id, message) => ({ type: ROOMS_MESSAGES_ADD, id, message })
export const roomsMessagesSet = (id, messages) => ({ type: ROOMS_MESSAGES_SET, id, messages })
export const roomsMessagesUpdate = (id, message) => ({ type: ROOMS_MESSAGES_UPDATE, id, message })
export const roomsMessagesDelete = (id, messageId) => ({ type: ROOMS_MESSAGES_DELETE, id, messageId })
