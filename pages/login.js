import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Router from 'next/router'
import { Input, Button, message } from 'antd'
import { FormattedMessage } from 'react-intl'
import I from 'immutable'
import { TR } from '../utils/translation'
import { viewSetIn, redirectIfAuthorized } from '../redux/modules/view'
import { selfSet } from '../redux/modules/self'
import { post, removeAuthorization } from '../utils/request'
import FormUnderNavLayout from '../components/layouts/FormUnderNavLayout'

const Login = () => {
  redirectIfAuthorized('/')
  const dispatch = useDispatch()
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
      dispatch(selfSet(I.fromJS(res)))
      dispatch(viewSetIn(['loginDialogOpen'], false))
      Router.push('/chat')
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
        <span role="presentation" className="C-P" style={{ textDecoration: 'underline' }} onClick={() => Router.push('/signup')}>
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
    </FormUnderNavLayout>
  )
}

export default Login
