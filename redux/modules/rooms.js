import I, { isImmutable, List, Map } from 'immutable'

export const ROOMS_SET = 'ROOMS_SET'
export const ROOMS_MESSAGES_ADD = 'ROOMS_MESSAGES_ADD'
export const ROOMS_MESSAGES_SET = 'ROOMS_MESSAGES_SET'

const initialState = I.fromJS({})
export default (rooms = initialState, action) => {
  const { id } = action
  switch (action.type) {
    case ROOMS_SET:
      return I.fromJS(action.rooms)
    case ROOMS_MESSAGES_SET:
      return rooms.setIn([id, 'messages'], I.fromJS(action.messages))
    case ROOMS_MESSAGES_ADD:
      return rooms.updateIn([id, 'messages'], messages => (messages || List()).push(Map(action.message)))
    default:
      if (!isImmutable(rooms)) {
        return I.fromJS(rooms)
      }
      return rooms
  }
}

export const roomsSet = rooms => ({ type: ROOMS_SET, rooms })
export const roomsMessagesAdd = (id, message) => ({ type: ROOMS_MESSAGES_ADD, id, message })
export const roomsMessagesSet = (id, messages) => ({ type: ROOMS_MESSAGES_SET, id, messages })
