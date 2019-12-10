import { viewSetIn, authorizedPath } from '%view'
import { HttpState } from '../consts'
import { selfSet } from '../redux/modules/self'
import authedActionCable from './authedActionCable'

export default function() {
  const cable = authedActionCable()
  if (!cable) return null
  const channel = cable.subscriptions.create(
    { channel: 'UsersChannel' },
    {
      connected: () => {
        if (STATE().view.getIn(authorizedPath) !== true) {
          DISPATCH(viewSetIn(authorizedPath, true))
        }
        channel.load('self')
      },
      disconnected: () => {
        if (STATE().view.getIn(authorizedPath) === HttpState.UNKNOWN) {
          DISPATCH(viewSetIn(authorizedPath, false))
        }
      },
      subscribed: () => console.info('subscripted'),
      received: receivedData => {
        const { data, path } = receivedData
        switch (path) {
          case 'self':
            DISPATCH(selfSet(data))
            break
          default:
            break
        }
      },
      load(path, data) {
        return this.perform('load', {
          path,
          data
        })
      }
    }
  )
  return channel
}
