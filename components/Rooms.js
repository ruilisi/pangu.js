import React from 'react'
import { message, Dropdown, Menu } from 'antd'
import { useDispatch } from 'react-redux'
import { post, httpDelete } from '../utils/request'
import { roomsRemove } from '../redux/modules/rooms'

const quitRooms = async id => {
  const res = await post('rooms/quit_room', { id })
  return res
}

const deleteRooms = async id => {
  const res = await httpDelete(`rooms/${id}`)
  return res
}

const Rooms = props => {
  const dispatch = useDispatch()
  const { rooms, switchRoom } = props

  const menu = id => (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() =>
          deleteRooms(id).then(body => {
            if (body.ok === false) {
              message.info('you are not the room owner')
            } else {
              dispatch(roomsRemove(body.id))
            }
          })
        }
      >
        删除房间
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() =>
          quitRooms(id).then(body => {
            dispatch(roomsRemove(body.id))
          })
        }
      >
        退出房间
      </Menu.Item>
    </Menu>
  )

  return (
    <Menu className="TA-L PL-10" style={{ background: '#3f0e40', color: 'white' }}>
      {rooms
        .map(v => {
          const { id, title } = v.toJS()
          return (
            <Menu.Item key={id}>
              <Dropdown overlay={menu(id)} trigger={['contextMenu']}>
                <p role="presentation" onClick={() => switchRoom(id)}>
                  {title}
                </p>
              </Dropdown>
            </Menu.Item>
          )
        })
        .toList()}
    </Menu>
  )
}
export default Rooms
