import React, { useEffect, useState } from 'react'
import { List, Avatar } from 'antd'
import { useSelector } from 'react-redux'
import { get } from '../utils/request'

const userList = async id => {
  const res = await get('rooms/user_list', { id })
  return res
}

const UserList = props => {
  const { id, style, className } = props
  const [users, setUsers] = useState([])
  const view = useSelector(state => state.view)
  const timeStamp = view.get('timeStamp')

  useEffect(() => {
    if (!id) return
    userList(id).then(body => {
      setUsers(body)
    })
  }, [id, timeStamp])

  return (
    <List
      style={style}
      className={className}
      itemLayout="horizontal"
      split={false}
      dataSource={users}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={
              <span style={{ color: 'white' }} className="ML-5">
                <Avatar src={item.avatar} />
                <span className="ML-5">{item.email}</span>
              </span>
            }
          />
        </List.Item>
      )}
    />
  )
}
export default UserList
