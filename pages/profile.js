import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar } from 'antd'

import { get } from '../utils/request'
import { redirectIfAuthorized, viewSetIn } from '../redux/modules/view'
import FormUnderNavLayout from '../components/layouts/FormUnderNavLayout'
import FileUploader from '../components/FileUploader'
import usersChannel from '../utils/usersChannel'

const Profile = () => {
  redirectIfAuthorized('/login', false)

  const D = useDispatch()
  const view = useSelector(state => state.view)
  const qiniuToken = view.get('qiniuToken')
  useEffect(() => {
    if (!qiniuToken) {
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
        {qiniuToken ? (
          <FileUploader
            token={qiniuToken}
            keyPrefix="avatar"
            onSuccess={avatar => {
              console.info(avatar)
              if (channel) {
                channel.load('set_avatar', { avatar })
              }
            }}
          />
        ) : null}
      </div>
    </FormUnderNavLayout>
  )
}

export default Profile
