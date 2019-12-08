import actionCable from './actionCable'

export default authorization => {
  const cable = actionCable()
  const roomsChannel = cable.subscriptions.create(
    { channel: 'RoomsChannel', authorization },
    {
      connected: data => {
        console.info('connected', data)
        roomsChannel.load('self', {})
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
