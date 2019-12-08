import dns from './dns'
import { getAuthorization } from './request'

export const authorization2ActionCable = {}
export default () => {
  const authorization = getAuthorization()
  if (!authorization) {
    return null
  }
  console.info('good', authorization)
  if (!authorization2ActionCable[authorization]) {
    authorization2ActionCable[authorization] = ActionCable.createConsumer(`${dns.API_ROOT}/cable`, (authorization || '').split(' ')[1])
  }
  return authorization2ActionCable[authorization]
}
