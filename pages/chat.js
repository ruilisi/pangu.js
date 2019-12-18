import I, { Map, List } from 'immutable'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Col, Input, Avatar, Row, Card } from 'antd'
import { Remarkable } from 'remarkable'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { get } from '../utils/request'
import { roomsSet } from '../redux/modules/rooms'
import roomsChannel from '../utils/roomsChannel'
import { redirectIfAuthorized, viewSetIn } from '../redux/modules/view'
import Setting from '../components/Setting'
import UserList from '../components/UserList'
import Rooms from '../components/Rooms'
import Lottery from '../components/lottery'
import Viewers from '../components/viewers'

const getRooms = async () => {
  const res = await get('rooms')
  return res
}

const md = new Remarkable({
  breaks: true,
  langPrefix: 'language-',
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (err) {
        console.info(err)
      }
    }

    try {
      return hljs.highlightAuto(str).value
    } catch (err) {
      console.info(err)
    }

    return '' // use external default escaping
  }
})

const Chat = () => {
  redirectIfAuthorized('/login', false)
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [channel, setChannel] = useState()
  const [text, setText] = useState('')
  const rooms = useSelector(state => state.rooms)
  const view = useSelector(state => state.view)
  const self = useSelector(state => state.self)
  const avatars = view.getIn(['avatars']).toJS()
  const room = rooms.get(roomId, Map())
  const show = view.getIn(['showLottery'])

  const switchRoom = id => {
    setRoomId(id)
    setChannel(roomsChannel(id))
  }

  useEffect(() => {
    getRooms().then(body => {
      if (body.status === 401) return
      dispatch(roomsSet(I.fromJS(body)))
    })
  }, [])

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (text.trim() === '') return
      channel.load('add_message', { room_id: roomId, text })
      setText('')
      e.preventDefault()
    }
  }

  return (
    <div>
      <Modal footer={null} visible={visible} onCancel={() => setVisible(false)}>
        <Lottery
          submit={(a, b, c) => {
            channel.load('lottery', { room_id: roomId, gold: a, silver: b, bronze: c })
            setVisible(false)
          }}
        />
      </Modal>
      <Modal footer={null} visible={show} onCancel={() => dispatch(viewSetIn(['showLottery'], true))}>
        <Viewers
          prizes={view.getIn(['lottery']).toJS()}
          submit={() => {
            dispatch(viewSetIn(['showLottery'], false))
          }}
        />
      </Modal>
      <Row>
        <Col span={4} className="border-card" style={{ height: '100vh', background: '#3f0e40', overflow: 'hidden' }}>
          <div className="FS-10 TA-C PT-20">
            <Row style={{ display: 'flex', alignItems: 'center' }}>
              <Col span={12}>
                <Avatar src={self.getIn(['data', 'avatar'])} shape="circle" size="large" />
              </Col>
              <Col span={12}>
                <Setting />
              </Col>
            </Row>
          </div>
          <Card style={{ background: '#3f0e40', height: '20vh', overflowY: 'scroll' }} bordered={false}>
            <Rooms rooms={rooms} switchRoom={switchRoom} />
          </Card>
          <Card style={{ background: '#3f0e40', height: '60vh', overflowY: 'scroll' }} bordered={false}>
            <UserList id={roomId} style={{ height: '70vh' }} />
          </Card>
        </Col>
        {!roomId ? (
          <Col span={20} style={{ textAlign: 'center', height: '100vh', lineHeight: '100vh' }}>
            新建或加入一个房间开始你的聊天吧
          </Col>
        ) : (
          <Col span={20} style={{ height: '100vh', overflow: 'hidden' }}>
            <div className="FS-10 ML-5" style={{ height: '10vh' }}>
              {rooms.toJS()[roomId] === undefined ? '' : rooms.toJS()[roomId].title}
            </div>
            <Row>
              <Card style={{ height: '80vh', overflowY: 'scroll' }} bordered={false}>
                {room.get('messages', List()).map(v => (
                  <Row key={v.get('id')}>
                    <Col span={1} className="ML-5">
                      <Avatar src={avatars[v.get('user_id')]} />
                    </Col>
                    <Col span={10}>
                      <div className="bold FS-7">
                        {v.getIn(['data', 'email'])}
                        <span style={{ fontWeight: 'lighter', color: 'grey', fontSize: 12, marginLeft: 10 }}>
                          {new Date(v.get('created_at')).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: md.render(v.get('text')) }} />
                    </Col>
                  </Row>
                ))}
              </Card>
            </Row>
            <div className="TA-C bottom-input">
              <Input.TextArea
                value={text}
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="随便吐槽一下吧"
                style={{ background: '#ffffff', width: '100%', margin: '30px 20px' }}
                onChange={e => {
                  setText(e.target.value)
                }}
                onKeyDown={onKeyDown}
              />
            </div>
          </Col>
        )}
      </Row>
      <style jsx global>
        {`
          .ant-menu-vertical {
            border: none;
          }
          .bottom-input {
            height: auto;
            width: 100%;
            display: flex;
            align-items: center;
            background: #e9f5fa;
            position: absolute;
            bottom: 0px;
          }
          .border-card {
            height: 100vh;
            border-right: 1px solid #000;
          }
        `}
      </style>
    </div>
  )
}

export default Chat
