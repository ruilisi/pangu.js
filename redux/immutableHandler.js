import I, { isImmutable } from 'immutable'

export default reducer => (aState, action) => {
  let { path, value } = action
  let state
  if (!isImmutable(aState)) {
    state = I.fromJS(aState)
  } else {
    state = aState
  }
  if (!isImmutable(value)) {
    value = I.fromJS(value)
  }
  if (!Array.isArray(path)) {
    path = [path]
  }
  return reducer(state, { ...action, value, path })
}
