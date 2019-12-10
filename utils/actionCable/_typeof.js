export default typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
  ? obj => typeof obj
  : obj => (obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj)
