import { Map, List } from 'immutable'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { message, Icon, Popover, Modal, Col, Avatar, Row, Card } from 'antd'
import { animateScroll } from 'react-scroll'
import { viewSetIn, viewMergeIn } from '%view'
import LeftSidebar from '~/components/layouts/LeftSidebar'
import MessageInput from '~/components/MessageInput'
import 'emoji-mart/css/emoji-mart.css'
import PPP from '~/components/PPP'
import RoomsConsumer from '~/consumers/RoomsConsumer'
import MessageContent from '../../../components/MessageContent'

const gameComponent = (game, roomId, subscription) => {
  switch (game.get('type')) {
    case 'PPP':
      return <PPP subscription={subscription} roomId={roomId} />
    default:
      return null
  }
}

const Chat = () => {
  const router = useRouter()
  const { roomId } = router.query
  const dp = useDispatch()
  const rooms = useSelector(state => state.rooms)
  const view = useSelector(state => state.view)
  const self = useSelector(state => state.self)
  const avatars = view.getIn(['avatars']).toJS()
  const messageId = view.getIn(['messageId'])
  const room = rooms.get(roomId, Map())
  const messages = room.get('messages', List())
  const game = view.get('game')

  const shortcuts = [[/\/PPP/, () => dp(viewMergeIn('game', { show: true, type: 'PPP' }))]]

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
    <RoomsConsumer roomId={roomId}>
      {({ subscription }) => (
        <div>
          <Modal footer={null} visible={game.get('show')} onCancel={() => dp(viewSetIn(['game', 'show'], false))}>
            {gameComponent(game, roomId, subscription)}
          </Modal>
          <Row>
            <LeftSidebar subscription={subscription} />
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
                    {messages.map((v, idx) =>
                      messageId !== v.get('id') ? (
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
                                <MessageContent message={v} avatars={avatars} subscription={subscription} />
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
                                <MessageContent message={v} avatars={avatars} subscription={subscription} />
                              </div>
                            </>
                          )}
                          <div className="action-menu">
                            <Popover content={<p>编辑消息</p>}>
                              <Icon
                                type="edit"
                                onClick={() => {
                                  if (self.getIn(['id']) !== v.get('user_id')) {
                                    message.info("You can not delete others's message")
                                    return
                                  }
                                  dp(viewSetIn(['messageId'], v.get('id')))
                                }}
                                style={{ margin: '8px', fontSize: '20px' }}
                              />
                            </Popover>
                            <Popover content={<p>删除消息</p>}>
                              <Icon
                                type="delete"
                                onClick={() => {
                                  if (self.getIn(['id']) !== v.get('user_id')) {
                                    message.info("You can not delete others's message")
                                    return
                                  }
                                  subscription.perform('load', { path: 'delete_message', data: { room_id: roomId, message_id: v.get('id') } })
                                }}
                                style={{ margin: '8px', fontSize: '20px' }}
                              />
                            </Popover>
                          </div>
                        </div>
                      ) : (
                        <MessageInput
                          defaultText={v.get('text')}
                          subscription={subscription}
                          roomId={roomId}
                          onSend={text => {
                            subscription.perform('load', { path: 'update_message', data: { room_id: roomId, text, message_id: messageId } })
                            dp(viewSetIn(['messageId'], null))
                          }}
                        />
                      )
                    )}
                  </Card>
                  <MessageInput
                    ref={messageInputRef}
                    subscription={subscription}
                    roomId={roomId}
                    onSend={text => {
                      const shortcut = shortcuts.find(([tester]) => {
                        if (tester instanceof RegExp) {
                          return tester.test(text)
                        }
                        return false
                      })
                      if (shortcut) {
                        const [, func] = shortcut
                        func()
                      } else {
                        subscription.perform('load', { path: 'add_message', data: { room_id: roomId, text } })
                      }
                    }}
                  />
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
              .action-menu {
                background: #fff;
                border: 1px solid #eee;
                border-radius: 5px;
                visibility: hidden;
                margin-top: -20px;
                position: absolute;
                right: 30px;
              }
              .message:hover .action-menu {
                visibility: visible;
              }
            `}
          </style>
        </div>
      )}
    </RoomsConsumer>
  )
}

export default Chat
