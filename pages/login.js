import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Button, message, Modal } from 'antd'
import { FormattedMessage } from 'react-intl'
import QRCode from 'qrcode.react'
import { TR } from '../utils/translation'
import { redirectIfAuthorized, setAuthorized } from '../redux/modules/view'
import { post, removeAuthorization } from '../utils/request'
import FormUnderNavLayout from '../components/layouts/FormUnderNavLayout'
import guestsChannel from '../utils/guestsChannel'
import usersChannel from '../utils/usersChannel'

const guest = 'GUEST'.concat(
  Math.random()
    .toString(36)
    .substring(7)
)
const redirectUri = `https://pangu.ruilisi.co/wechat/login_callback?guest=${guest}`

const Login = () => {
  redirectIfAuthorized('/')
  const router = useRouter()
  const dispatch = useDispatch()
  const wechatAppId = useSelector(state => state.view.getIn(['data', 'wechat_app_id']))
  const [showWechatLoginModal, setShowWechatLoginModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const postLogin = async (_username, _password) => {
    const res = await post('users/sign_in', { user: { email: _username, password: _password } })
    return res
  }
  const login = async (u, p) => {
    removeAuthorization()
    const res = await postLogin(u, p)
    if (res.id) {
      localStorage.setItem('Id', res.id)
      message.success('登录成功')
      dispatch(setAuthorized(true))
      usersChannel()
    } else {
      message.error(res.error)
    }
    setSubmitting(false)
  }
  const onKeyPress = e => {
    if (e.key === 'Enter') {
      setSubmitting(true)
      login(username, password)
    }
  }

  return (
    <FormUnderNavLayout title={TR('Login')}>
      <div className="TA-C FS-7 MTB-20" style={{ color: 'white' }}>
        {TR('Not a member yet?')}
        <span role="presentation" className="C-P" style={{ textDecoration: 'underline' }} onClick={() => router.push('/signup')}>
          {TR('Sign Up here')}
        </span>
      </div>
      <FormattedMessage id="Email">
        {placeholder => (
          <Input
            key="1"
            size="large"
            type="text"
            placeholder={placeholder}
            autoFocus
            className="H-24"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        )}
      </FormattedMessage>
      <FormattedMessage id="Password">
        {placeholder => (
          <Input
            key="2"
            size="large"
            type="password"
            placeholder={placeholder}
            className="MT-12 H-24"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={onKeyPress}
          />
        )}
      </FormattedMessage>
      <div key="3" className="MT-22">
        <Button
          className="H-24"
          type="primary"
          size="large"
          loading={submitting}
          onClick={e => {
            setSubmitting(true)
            e.preventDefault()
            login(username, password)
          }}
          style={{ width: '100%' }}
        >
          {TR('Login')}
        </Button>
      </div>
      {wechatAppId ? (
        <div key="3" className="MT-22">
          <Button
            className="H-24"
            type="secondary"
            size="large"
            loading={submitting}
            onClick={() => {
              setShowWechatLoginModal(true)
              guestsChannel(guest)
            }}
            style={{ width: '100%' }}
          >
            {TR('Wechat Login')}
          </Button>
        </div>
      ) : null}
      <Modal title="Wechat Login" visible={showWechatLoginModal} onCancel={() => setShowWechatLoginModal(false)}>
        <div className="TA-C">
          <QRCode
            size={256}
            value={`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`}
          />
        </div>
      </Modal>
    </FormUnderNavLayout>
  )
}

export default Login
