import { createConsumer } from 'actioncable-jwt'
import { viewSetIn, authorizedPath } from '%view'
import dns from './dns'
import { setAuthorization } from './request'

export default function(guest) {
  if (!guest) return null
  const cable = createConsumer(`${dns.API_ROOT}/cable`, guest)
  const channel = cable.subscriptions.create(
    { channel: 'GuestsChannel' },
    {
      connected: () => {
        console.info('conentc suc')
      },
      disconnected: () => {},
      subscribed: () => console.info('subscripted'),
      unsubscribed: () => console.info('unsubscripted'),
      received: receivedData => {
        console.info('recdata', receivedData)
        const { data, path } = receivedData
        switch (path) {
          case 'wechat_login':
            if (STATE().view.getIn(authorizedPath) !== true) {
              DISPATCH(viewSetIn(authorizedPath, true))
            }
            setAuthorization(data)
            channel.unsubscribe()
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
