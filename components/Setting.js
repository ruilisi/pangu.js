import React, { useState } from 'react'
import I from 'immutable'
import { message, Row, Col, Icon, Dropdown, Menu, Modal, Input } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { post } from '../utils/request'
import { roomsAdd } from '../redux/modules/rooms'
import { logout } from '../api/sessions'
import { TR } from '../utils/translation'

const createRooms = async title => {
  const res = await post('rooms', { title })
  return res
}

const joinRooms = async title => {
  const res = await post('rooms/join_room', { title })
  return res
}

const Setting = ({ subscription }) => {
  const dispatch = useDispatch()
  const self = useSelector(s => s.self)
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [menuItem, setMenuItem] = useState('')
  const router = useRouter()

  const handleOk = () => {
    if (menuItem === 'Create Room') {
      createRooms(title).then(body => {
        if (body.ok === 'false') {
          message.info('Failed to create room')
        } else {
          dispatch(roomsAdd(I.fromJS(body)))
          router.push(`/client/${self.get('id')}/${Object.keys(body)[0]}`)
        }
        setTitle('')
        setShow(false)
      })
    } else {
      joinRooms(title).then(body => {
        if (body.ok === false) {
          message.info('Room does not exit')
        } else {
          dispatch(roomsAdd(I.fromJS(body)))
          const roomId = Object.keys(body)[0]
          router.push(`/client/${self.get('id')}/${roomId}`)
          subscription.perform('load', {
            path: 'join_room',
            data: { room_id: roomId, text: `joined ${Object.values(body)[0].title}` }
          })
        }
        setTitle('')
        setShow(false)
      })
    }
  }

  const handleCancel = () => {
    setShow(false)
  }

  const menuList = ['Create Room', 'Join Room']

  const menu = (
    <Menu>
      {menuList.map(v => (
        <Menu.Item
          key={v}
          onClick={() => {
            setMenuItem(v)
            setShow(true)
          }}
        >
          {TR(v)}
        </Menu.Item>
      ))}
      <Menu.Item onClick={() => dispatch(logout())}>{TR('Logout')}</Menu.Item>
    </Menu>
  )

  return (
    <div>
      <Dropdown overlay={menu}>
        <Icon type="plus-circle" style={{ color: '#fff' }} />
      </Dropdown>
      <Modal title={TR(menuItem)} visible={show} onOk={handleOk} onCancel={handleCancel}>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30 }}>
          <Col span={4}>{TR('Room Name')}</Col>
          <Col span={20}>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default Setting
