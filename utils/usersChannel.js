import { viewSetIn, authorizedPath } from '%view'
import { HttpState } from '../consts'
import { selfSet } from '../redux/modules/self'
import actionCable from './actionCable'

export default () => (D, S) => {
  const cable = actionCable()
  if (!cable) return
  const usersChannel = cable.subscriptions.create(
    { channel: 'UsersChannel' },
    {
      connected: data => {
        console.info('connected', data)
        if (S().view.getIn(authorizedPath) !== true) {
          D(viewSetIn(authorizedPath, true))
        }
        usersChannel.load('self', {})
      },
      disconnected: () => {
        if (S().view.getIn(authorizedPath) === HttpState.UNKNOWN) {
          D(viewSetIn(authorizedPath, false))
        }
      },
      subscribed: () => console.info('subscripted'),
      received: receivedData => {
        console.info('receivedData', receivedData)
        const { data, type } = receivedData
        switch (type) {
          case 'self':
            D(selfSet(data))
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
}
