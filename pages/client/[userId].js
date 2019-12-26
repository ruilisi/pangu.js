import React from 'react'
import { Row } from 'antd'
import { useRouter } from 'next/router'
import RoomsConsumer from '~/consumers/RoomsConsumer'
import LeftSidebar from '~/components/layouts/LeftSidebar'

export default () => {
  const { roomId } = useRouter().query
  return (
    <RoomsConsumer roomId={roomId}>
      {({ subscription }) => (
        <div>
          <Row>
            <LeftSidebar subscription={subscription} />
          </Row>
        </div>
      )}
    </RoomsConsumer>
  )
}
