import React, { useState } from 'react'
import I from 'immutable'
import { Row, Col, Switch, Icon, Dropdown, Menu, Modal, Input } from 'antd'
import { useDispatch } from 'react-redux'
import { post } from '../utils/request'
import { roomsAdd } from '../redux/modules/rooms'

const createRooms = async (title, visibility) => {
  const res = await post('rooms', { title, visibility })
  return res
}

const Setting = () => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [visibility, setVisibility] = useState(false)
  const [title, setTitle] = useState('')

  const handleOk = () => {
    createRooms(title, visibility).then(body => {
      dispatch(roomsAdd(I.fromJS(body)))
      setTitle('')
      setShow(false)
    })
  }

  const handleCancel = () => {
    setShow(false)
    setVisibility(false)
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setShow(true)}>新建房间</Menu.Item>
    </Menu>
  )
  return (
    <div>
      <Dropdown overlay={menu}>
        <Icon type="more" />
      </Dropdown>
      <Modal title="新建房间" visible={show} onOk={handleOk} onCancel={handleCancel}>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30, marginBottom: '20px' }}>
          <Col span={4}>title</Col>
          <Col span={20}>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </Col>
        </Row>
        <Row>
          <Col span={4}>visibilty</Col>
          <Col span={20}>
            <Switch checkedChildren="public" unCheckedChildren="private" checked={visibility} onChange={checked => setVisibility(checked)} />
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default Setting
