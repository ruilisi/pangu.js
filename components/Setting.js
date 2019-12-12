import React, { useState } from 'react'
import I from 'immutable'
import { message, Row, Col, Icon, Dropdown, Menu, Modal, Input } from 'antd'
import { useDispatch } from 'react-redux'
import { post } from '../utils/request'
import { roomsAdd } from '../redux/modules/rooms'

const createRooms = async title => {
  const res = await post('rooms', { title })
  return res
}

const joinRooms = async title => {
  const res = await post('rooms/join_room', { title })
  return res
}

const Setting = () => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [menuItem, setMenuItem] = useState('')

  const handleOk = () => {
    if (menuItem === '新建房间') {
      createRooms(title).then(body => {
        if (body.ok === 'false') {
          message.info('Failed to create room')
        } else {
          dispatch(roomsAdd(I.fromJS(body)))
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
        }
        setTitle('')
        setShow(false)
      })
    }
  }

  const handleCancel = () => {
    setShow(false)
  }

  const menuList = ['新建房间', '加入房间']

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
          {v}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div>
      <Dropdown overlay={menu}>
        <Icon type="more" />
      </Dropdown>
      <Modal title={menuItem} visible={show} onOk={handleOk} onCancel={handleCancel}>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30 }}>
          <Col span={4}>title</Col>
          <Col span={20}>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default Setting
