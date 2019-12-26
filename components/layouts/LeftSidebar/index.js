import React from 'react'
import { Col, Card, Avatar, Row } from 'antd'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Setting from '~/components/Setting'
import UserList from '../../UserList'
import RoomList from './RoomList'

export default ({ subscription }) => {
  const self = useSelector(s => s.self)
  const rooms = useSelector(s => s.rooms)
  const router = useRouter()
  const { roomId } = router.query
  return (
    <>
      <Col span={4} className="border-card" style={{ height: '100vh', background: '#3f0e40', overflow: 'hidden' }}>
        <div className="FS-10 TA-C PT-20">
          <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col span={12}>
              <Avatar src={self.getIn(['data', 'avatar'])} shape="circle" size="large" onClick={() => router.push('/profile')} />
            </Col>
            <Col span={12}>
              <Setting subscription={subscription} />
            </Col>
          </Row>
        </div>
        <Card style={{ background: '#3f0e40', height: '40vh', overflowY: 'scroll' }} bordered={false}>
          <RoomList rooms={rooms} roomId={roomId} />
        </Card>
        <Card style={{ background: '#3f0e40', height: '60vh', overflowY: 'scroll' }} bordered={false}>
          <UserList id={roomId} style={{ height: '70vh' }} />
        </Card>
      </Col>
    </>
  )
}
