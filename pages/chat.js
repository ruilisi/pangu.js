import I, { Map, List } from 'immutable'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Input, Button, Avatar, Row, Menu, Card } from 'antd'
import { get, httpDelete, removeAuthorization } from '../utils/request'
import { roomsSet } from '../redux/modules/rooms'
import roomsChannel from '../utils/roomsChannel'
import { redirectIfAuthorized } from '../redux/modules/view'

const getRooms = async () => {
  const res = await get('rooms')
  return res
}

const Chat = () => {
  redirectIfAuthorized('/login', false)
  const router = useRouter()
  const dispatch = useDispatch()
  const [roomId, setRoomId] = useState('')
  const [channel, setChannel] = useState()
  const [text, setText] = useState('')
  const rooms = useSelector(state => state.rooms)
  const view = useSelector(state => state.view)
  const self = useSelector(state => state.self)
  const avatars = view.getIn(['avatars']).toJS()
  const room = rooms.get(roomId, Map())

  const switchRoom = id => {
    setRoomId(id)
    setChannel(roomsChannel(id))
  }

  const sendMessageButtonRef = useRef(null)
  useEffect(() => {
    getRooms().then(body => {
      dispatch(roomsSet(I.fromJS(body)))
      const id = Object.keys(body)[0]
      switchRoom(id)
    })
  }, [])

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      if (text === '') return
      channel.load('add_message', { room_id: roomId, text })
      setText('')
    }
  }
  return (
    <div>
      <Col span={4} className="border-card" style={{ overflow: 'hidden' }}>
        <div className="FS-10 TA-C PT-20">
          <Avatar src={self.getIn(['data', 'avatar'])} shape="circle" size="large" />
        </div>
        <Card style={{ height: '65vh', overflowY: 'scroll' }} bordered={false}>
          <Menu className="TA-C" selectedKeys={[roomId]}>
            {rooms
              .map(v => {
                const { id, title } = v.toJS()
                return (
                  <Menu.Item key={id} onClick={() => switchRoom(id)}>
                    {title}
                  </Menu.Item>
                )
              })
              .toList()}
          </Menu>
        </Card>

        <div className="MT-5 TA-C MB-50">
          <Button
            type="primary"
            size="large"
            style={{ paddingLeft: 30, paddingRight: 30 }}
            onClick={() => {
              httpDelete('users/sign_out').then(() => {
                removeAuthorization()
                router.replace('/')
              })
            }}
          >
            Logout
          </Button>
        </div>
      </Col>
      <Col span={20} style={{ overflow: 'hidden' }}>
        <div className="FS-10 ML-5" style={{ height: '10vh', display: 'flex', alignItems: 'center' }}>
          {rooms.toJS()[roomId] === undefined ? '' : rooms.toJS()[roomId].title}
        </div>
        <Card style={{ background: '#e1e1e1', height: '80vh', overflowY: 'scroll' }} bordered={false}>
          {room.get('messages', List()).map(v => {
            return v.get('user_id') === self.get('id') ? (
              <Row key={v.get('id')}>
                <Col span={10} push={13}>
                  <div>{v.getIn(['data', 'email'])}</div>
                  <div>{v.get('created_at')}</div>
                  <p className="my-text">{v.get('text')}</p>
                </Col>
                <Col span={1} push={13}>
                  <Avatar src={avatars[v.get('user_id')]} />
                </Col>
              </Row>
            ) : (
              <Row key={v.get('id')}>
                <Col span={1}>
                  <Avatar src={avatars[v.get('user_id')]} />
                </Col>
                <Col span={10}>
                  <div>{v.getIn(['data', 'email'])}</div>
                  <div>{v.get('created_at')}</div>
                  <p className="other-text">{v.get('text')}</p>
                </Col>
              </Row>
            )
          })}
          <div ref={sendMessageButtonRef} />
        </Card>
        <div className="TA-C" style={{ height: '10vh', display: 'flex', alignItems: 'center' }}>
          <Col className="display-center" span={18} push={2}>
            <Input
              value={text}
              size="large"
              placeholder="随便吐槽一下吧"
              style={{ background: '#e1e1e1', width: '100%' }}
              onChange={e => {
                setText(e.target.value)
              }}
              onKeyPress={onKeyPress}
            />
          </Col>
          <Col className="display-center" span={4} push={2}>
            <Button
              size="large"
              type="primary"
              className="PLR-15"
              onClick={() => {
                if (text === '' || roomId === '') return
                channel.load('add_message', { room_id: roomId, text })
                setText('')
              }}
            >
              发送
            </Button>
          </Col>
        </div>
      </Col>
      <style jsx global>
        {`
          .ant-menu-vertical {
            border: none;
          }
          .border-card {
            height: 100vh;
            border-right: 1px solid #000;
          }
          .my-text {
            background: #2a2a2a;
            color: white;
            padding: 10px;
            margin-right: 10px;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
          .other-text {
            background: white;
            color: black;
            padding: 10px;
            border-top-right-radius: 8px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        `}
      </style>
    </div>
  )
}

export default Chat
