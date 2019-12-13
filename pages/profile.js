import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar } from 'antd'

import { QiniuAntd } from 'react-pangu'
import { get } from '../utils/request'
import { redirectIfAuthorized, viewSetIn } from '../redux/modules/view'
import FormUnderNavLayout from '../components/layouts/FormUnderNavLayout'
import usersChannel from '../utils/usersChannel'

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
  const [channel, setChannel] = useState(null)
  useEffect(() => {
    setChannel(usersChannel())
  }, [])
  return (
    <FormUnderNavLayout title="Profile">
      <div className="TA-C">
        <div className="MB-2">
          <Avatar className="align-center D-B" src={self.getIn(['data', 'avatar'])} shape="circle" size={128} />
        </div>
        {token ? (
          <QiniuAntd
            token={token}
            keyPrefix="avatar"
            onSuccess={key => {
              if (channel) {
                channel.load('set_avatar', { avatar: `http://res.paiyou.co/${key}` })
              }
            }}
          />
        ) : null}
      </div>
    </FormUnderNavLayout>
  )
}

export default Profile
