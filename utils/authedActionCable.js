import { createConsumer } from 'actioncable-jwt'
import dns from './dns'
import { getAuthorization } from './request'
import { viewSetIn, authorizedPath } from '%view'

export const authorization2ActionCable = {}
export default () => {
  const authorization = getAuthorization()
  if (!authorization) {
    DISPATCH(viewSetIn(authorizedPath, false))
    return null
  }
  if (!authorization2ActionCable[authorization]) {
    authorization2ActionCable[authorization] = createConsumer(`${dns.API_ROOT}/cable`, (authorization || '').split(' ')[1])
  }
  return authorization2ActionCable[authorization]
}
