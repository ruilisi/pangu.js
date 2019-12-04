import _ from 'lodash'
// eslint-disable-next-line import/no-cycle

const usedAuthorizations = []
const API_ROOT = 'http://192.168.1.6:88'
export default authorization => {
  if (_.includes(usedAuthorizations, authorization)) {
    return
  }
  usedAuthorizations.push(authorization)

  // eslint-disable-next-line no-undef
  const cable = ActionCable.createConsumer(`${API_ROOT}/cable`)
  const usersChannel = cable.subscriptions.create(
    { channel: 'UsersChannel', authorization },
    {
      connected: data => {
        console.info('connected', data)
        usersChannel.load('self', {})
        usersChannel.load('login_state', {})
      },
      subscribed: () => console.info('subscripted'),
      received: receivedData => {
        console.info('receivedData', receivedData)
        const { data, type } = receivedData
        switch (type) {
          case 'login_state':
            console.info(data)
            // DISPATCH(viewSetIn(['loginState', 'result'], data))
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
