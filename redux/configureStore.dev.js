import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const enhancer = composeEnhancers(
  // Middleware you want to use in development:
  applyMiddleware(thunk)
)

export default (initialState = {}) => {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0

  const store = createStore(makeRootReducer(), initialState, enhancer)
  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    // eslint-disable-next-line global-require
    module.hot.accept('./reducers', () => store.replaceReducer(require('./reducers')))
  }

  return store
}
