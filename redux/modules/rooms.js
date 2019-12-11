import I, { isImmutable, List, Map } from 'immutable'

export const ROOMS_SET = 'ROOMS_SET'
export const ROOMS_ADD = 'ROOMS_ADD'
export const ROOMS_REMOVE = 'ROOMS_REMOVE'
export const ROOMS_MESSAGES_ADD = 'ROOMS_MESSAGES_ADD'
export const ROOMS_MESSAGES_SET = 'ROOMS_MESSAGES_SET'

const initialState = I.fromJS({})
export default (rooms = initialState, action) => {
  const { id } = action
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
