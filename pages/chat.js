import I, { Map, List } from 'immutable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Input, Button, Avatar, Row, Menu, Card } from 'antd'
import localStorage from 'localStorage'
import { get, httpDelete, getToken, clearToken } from '../utils/request'
import { roomsSet, roomsMessagesSet, roomsMessagesAdd } from '../redux/modules/rooms'

const getRooms = async () => {
  const res = await get('rooms')
  return res
}

const roomChannels = {}
const messageSocket = roomId => {
  if (!window.cable) {
    window.cable = ActionCable.createConsumer('http://192.168.1.6:88/cable')
  }
  if (!roomChannels[roomId]) {
    const channel = window.cable.subscriptions.create(
      { channel: 'RoomsChannel', authorization: getToken(), room_id: roomId },
      {
        connected: () => {
          channel.load('messages', { room_id: roomId })
        },
        subscribed: () => console.info('subscripted'),
        received: data => {
          console.info('received', data)
          switch (data.path) {
            case 'messages':
              DISPATCH(roomsMessagesSet(data.room_id, data.messages))
              break
            case 'add_message':
              DISPATCH(roomsMessagesAdd(data.room_id, data.message))
              break
            default:
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
    roomChannels[roomId] = channel
  }
}

const Chat = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [roomId, setRoomId] = useState('')
  const [text, setText] = useState('')
  const rooms = useSelector(state => state.rooms)
  const room = rooms.get(roomId, Map())
  useEffect(() => {
    getRooms().then(body => {
      dispatch(roomsSet(I.fromJS(body)))
    })
  }, [])

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      if (text === '') return
      const channel = roomChannels[roomId]
      channel.load('add_message', { room_id: roomId, text })
      setText('')
    }
  }

  return (
    <div>
      <Col span={4} className="border-card" style={{ overflow: 'hidden' }}>
        <Card style={{ height: '90vh', overflowY: 'scroll' }} bordered={false} title={<div className="TA-C FS-10">房间列表</div>}>
          <Menu className="TA-C">
            {rooms
              .map(v => {
                const { id, title } = v.toJS()
                return (
                  <Menu.Item
                    key={id}
                    onClick={() => {
                      setRoomId(id)
                      messageSocket(id)
                    }}
                  >
                    {title}
                  </Menu.Item>
                )
              })
              .toList()}
          </Menu>
        </Card>

        <div className="MT-5 TA-C">
          <Button
            type="primary"
            size="large"
            style={{ paddingLeft: 30, paddingRight: 30 }}
            onClick={() => {
              httpDelete('users/sign_out').then(() => {
                clearToken()
                router.push('/')
              })
            }}
          >
            退出登录
          </Button>
        </div>
      </Col>
      <Col span={20} style={{ overflow: 'hidden' }}>
        <Card style={{ background: '#e1e1e1', height: '90vh', overflowY: 'scroll' }} bordered={false} title={<span className="FS-10">量子波动速读群</span>}>
          {room.get('messages', List()).map(v => {
            return v.get('user_id') === localStorage.getItem('Id') ? (
              <Row key={v.get('id')}>
                <Col span={10} push={13}>
                  <div>{v.getIn(['data', 'email'])}</div>
                  <div>{v.get('created_at')}</div>
                  <p className="my-text">{v.get('text')}</p>
                </Col>
                <Col span={1} push={13}>
                  <Avatar icon="user" />
                </Col>
              </Row>
            ) : (
              <Row key={v.get('id')}>
                <Col span={1}>
                  <Avatar icon="user" />
                </Col>
                <Col span={10}>
                  <div>{v.getIn(['data', 'email'])}</div>
                  <div>{v.get('created_at')}</div>
                  <p className="other-text">{v.get('text')}</p>
                </Col>
              </Row>
            )
          })}
        </Card>
        <div className="MT-5 TA-C">
          <Col span={18} push={2}>
            <Input
              value={text}
              size="large"
              placeholder="随便吐槽一下吧"
              style={{ background: '#e1e1e1' }}
              onChange={e => {
                setText(e.target.value)
              }}
              onKeyPress={onKeyPress}
            />
          </Col>
          <Col span={4} push={2}>
            <Button
              size="large"
              type="primary"
              onClick={() => {
                if (text === '') return
                const channel = roomChannels[roomId]
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
