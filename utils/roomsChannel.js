import _ from 'lodash'
import dns from '~/utils/dns'

const usedAuthorizations = []
export default authorization => {
  if (_.includes(usedAuthorizations, authorization)) {
    return
  }
  usedAuthorizations.push(authorization)

  // eslint-disable-next-line no-undef
  const cable = ActionCable.createConsumer(`${dns.API_ROOT}/cable`)
  const usersChannel = cable.subscriptions.create(
    { channel: 'UsersChannel', authorization },
    {
      connected: data => {
        console.info('connected', data)
        usersChannel.load('self', {})
      },
      subscribed: () => console.info('subscripted'),
      received: receivedData => {
        console.info('receivedData', receivedData)
        const { data, type } = receivedData
        switch (type) {
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
