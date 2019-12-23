import I from 'immutable'
import immutableHandler from '../immutableHandler'

export const SELF_SET_IN = 'SELF_SET_IN'
export const SELF_SET = 'SELF_SET'
export const SELF_MERGE = 'SELF_MERGE'
export const SELF_MERGE_IN = 'SELF_MERGE_IN'

const initialState = I.fromJS({})

export default immutableHandler((self = initialState, action) => {
  const { path, value } = action
  switch (action.type) {
    case SELF_SET:
      return value
    case SELF_MERGE_IN:
      return self.mergeIn(path, value)
    case SELF_MERGE:
      return self.merge(value)
    case SELF_SET_IN:
      return self.setIn(path, value)
    default:
      return self
  }
})

export const selfMerge = value => ({ type: SELF_MERGE, value })

export const selfMergeIn = (path, value) => ({ type: SELF_MERGE_IN, path, value })

export const selfSet = value => ({ type: SELF_SET, value })

export const selfSetIn = (path, value) => ({ type: SELF_SET_IN, path, value })
