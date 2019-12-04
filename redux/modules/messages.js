import I from 'immutable'
import immutableHandler from '../immutableHandler'

export const MESSAGES_SET = 'MESSAGES_SET'
export const MESSAGES_PUSH = 'MESSAGES_PUSH'

const initialState = I.fromJS({})

export default (messages = initialState, action) => {
  const { id, value } = action
  switch (action.type) {
    case MESSAGES_SET:
      return value
    case MESSAGES_PUSH:
      return messages.update(value)
    default:
      return messages
  }
}

export const messagesSet = value => ({ type: MESSAGES_SET, value })

export const messagesSetIn = (id, value) => ({ type: MESSAGES_PUSH, value, value })
