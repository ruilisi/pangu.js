const logger = {
  log: (...args) => {
    if (logger.enabled) {
      console.info('[ActionCable]', ...args, Date.now())
    }
    return null
  },
  enabled: false
}

export default logger
