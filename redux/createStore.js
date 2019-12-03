import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from './state'

export default (initialState = {}) => {
  return createStore(makeRootReducer(), initialState, applyMiddleware(thunk))
}
