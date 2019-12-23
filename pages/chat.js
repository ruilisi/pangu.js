import I, { Map, List } from 'immutable'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Modal, Col, Avatar, Row, Card } from 'antd'
import { Remarkable } from 'remarkable'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { animateScroll } from 'react-scroll'
import { get } from '../utils/request'
import { roomsSet } from '../redux/modules/rooms'
import roomsChannel from '../utils/roomsChannel'
import { redirectIfAuthorized, viewSetIn } from '../redux/modules/view'
import Setting from '../components/Setting'
import UserList from '../components/UserList'
import Rooms from '../components/Rooms'
import MessageInput from '../components/MessageInput'
import 'emoji-mart/css/emoji-mart.css'
import PPP from '../components/PPP'
import { Context } from '../contexts/ActionCableContext'

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

const gameComponent = (game, roomId, channel) => {
  switch (game.get('type')) {
    case 'PPP':
      return <PPP channel={channel} roomId={roomId} />
    default:
      return null
  }
}

const Chat = ({ ...props }) => {
  redirectIfAuthorized('/login', false)
  const dispatch = useDispatch()
  const [roomId, setRoomId] = useState('')
  const [channel, setChannel] = useState()
  const rooms = useSelector(state => state.rooms)
  const view = useSelector(state => state.view)
  const self = useSelector(state => state.self)
  const avatars = view.getIn(['avatars']).toJS()
  const room = rooms.get(roomId, Map())
  const router = useRouter()
  const messages = room.get('messages', List())
  const game = view.get('game')
  const cable = useContext(Context)

  const switchRoom = id => {
    setRoomId(id)
    setChannel(roomsChannel(cable, id))
  }

  useEffect(() => {
    getRooms().then(body => {
      if (body.status === 401) return
      dispatch(roomsSet(I.fromJS(body)))
    })
  }, [])

  useEffect(() => {
    animateScroll.scrollToBottom({
      containerId: 'messages',
      duration: 0
    })
  }, [messages])

  const newMessageHeader = (current, idx) => {
    if (idx === 0) return true
    const last = messages.get(idx - 1)
    return current.get('user_id') !== last.get('user_id') || new Date(current.get('created_at')).getTime() - new Date(last.get('created_at')).getTime() > 300000
  }

  const messageInputRef = useRef(null)

  return (
    <div>
      <Modal footer={null} visible={game.get('show')} onCancel={() => dispatch(viewSetIn(['game', 'show'], false))}>
        {gameComponent(game, roomId, channel)}
      </Modal>
      <Row>
        <Col span={4} className="border-card" style={{ height: '100vh', background: '#3f0e40', overflow: 'hidden' }}>
          <div className="FS-10 TA-C PT-20">
            <Row style={{ display: 'flex', alignItems: 'center' }}>
              <Col span={12}>
                <Avatar src={self.getIn(['data', 'avatar'])} shape="circle" size="large" onClick={() => router.push('/profile')} />
              </Col>
              <Col span={12}>
                <Setting switchRoom={switchRoom} />
              </Col>
            </Row>
          </div>
          <Card style={{ background: '#3f0e40', height: '20vh', overflowY: 'scroll' }} bordered={false}>
            <Rooms rooms={rooms} roomId={roomId} switchRoom={switchRoom} />
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
            <div className="FS-10 ML-5 top-border" style={{ height: '10vh' }}>
              {rooms.toJS()[roomId] === undefined ? '' : rooms.toJS()[roomId].title}
            </div>

            <Row style={{ height: '90vh', display: 'flex', flexDirection: 'column', alignContent: 'space-between' }}>
              <Card id="messages" style={{ flexGrow: 1, overflowY: 'scroll' }} bordered={false}>
                {messages.map((v, idx) => (
                  <div className="message PTB-3" key={v.get('id')}>
                    {newMessageHeader(v, idx) ? (
                      <>
                        <div className="inline ML-5 PT-2" style={{ width: '58px' }}>
                          <Avatar src={avatars[v.get('user_id')]} />
                        </div>
                        <div className="inline">
                          <div className="bold FS-7">
                            {v.getIn(['data', 'email'])}
                            <span style={{ fontWeight: 'lighter', color: 'grey', fontSize: 12, marginLeft: 10 }}>
                              {new Date(v.get('created_at')).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div dangerouslySetInnerHTML={{ __html: md.render(v.get('text')) }} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="inline ML-3 MR-2" style={{ width: '58px', display: 'flex', alignItems: 'center' }}>
                          <div className="hide-time" style={{ fontWeight: 'lighter', color: 'grey', fontSize: 6 }}>
                            {new Date(v.get('created_at')).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="inline">
                          <div dangerouslySetInnerHTML={{ __html: md.render(v.get('text')) }} />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </Card>
              <MessageInput ref={messageInputRef} channel={channel} roomId={roomId} />
            </Row>
          </Col>
        )}
      </Row>
      <style jsx global>
        {`
          .ant-menu-vertical {
            border: none;
          }
          .top-border {
            border-bottom-style: solid;
            border-width: 1px;
            border-color: #dddddd;
          }
          .bottom-input {
            height: auto;
            width: 100%;
            display: flex;
            align-items: center;
            background: #e9f5fa;
          }
          .border-card {
            height: 100vh;
            border-right: 1px solid #000;
          }
          .message {
            display: flex;
            align-items: top;
          }
          .hide-time {
            visibility: hidden;
          }
          .inline {
            display: inline-block;
          }
          p {
            margin-bottom: 0;
          }
          pre {
            margin-bottom: 0;
          }
          .message :hover {
            background: #f8f8f8;
          }
          .message:hover .hide-time {
            visibility: visible;
          }
        `}
      </style>
    </div>
  )
}

export default Chat
