import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'

export default (initialState = {}) => {
  const store = createStore(makeRootReducer(), initialState, applyMiddleware(thunk))
  return store
}
