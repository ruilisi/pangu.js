import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar } from 'antd'

import { QiniuAntd } from 'react-pangu'
import { get } from '../utils/request'
import { redirectIfAuthorized, viewSetIn } from '../redux/modules/view'
import FormUnderNavLayout from '../components/layouts/FormUnderNavLayout'
import { Consumer } from '../contexts/ActionCableContext'

const Profile = () => {
  redirectIfAuthorized('/login', false)

  const D = useDispatch()
  const view = useSelector(state => state.view)
  const token = view.get('qiniuToken')
  useEffect(() => {
    if (!token) {
      get('qiniu_token').then(data => {
        D(viewSetIn(['qiniuToken'], data && data.qiniuToken))
      })
    }
  }, [])
  const self = useSelector(state => state.self)
  return (
    <FormUnderNavLayout title="Profile">
      <div className="TA-C">
        <div className="MB-2">
          <Avatar className="align-center D-B" src={self.getIn(['data', 'avatar'])} shape="circle" size={128} />
        </div>
        <Consumer channel="UsersChannel">
          {({ subscription }) =>
            token ? (
              <QiniuAntd
                token={token}
                keyPrefix="avatar"
                onSuccess={key => {
                  subscription.perform('load', { path: 'set_avatar', data: { avatar: `http://res.paiyou.co/${key}` } })
                }}
              />
            ) : null
          }
        </Consumer>
      </div>
    </FormUnderNavLayout>
  )
}

export default Profile
