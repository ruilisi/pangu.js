import React, { useState } from 'react'
import { message, Input, Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import Router from 'next/router'
import { T, TR } from '../utils/translation'
import { redirectIfAuthorized } from '../redux/modules/view'
import { post } from '../utils/request'
import FormUnderNavLayout from '../components/layouts/FormUnderNavLayout'

const Signup = () => {
  redirectIfAuthorized('/')
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const signup = async params => {
    const res = await post('users', { user: params })
    if (res.id) {
      message.success('registration success')
      Router.push('/login')
    } else {
      message.error('registration failed, The account already exists')
    }
    setLoading(false)
  }

  return (
    <FormUnderNavLayout title={TR('Signup')}>
      <div className="TA-C FS-7 MTB-20" style={{ color: 'white' }}>
        <span role="presentation" className="C-P" style={{ textDecoration: 'underline' }} onClick={() => Router.push('/login')}>
          {TR('Already have an account?')}
        </span>
      </div>
      <FormattedMessage id="Email">
        {placeholder => (
          <Input autoFocus placeholder={placeholder} size="large" className="H-24" value={username} onChange={e => setUsername(e.target.value)} />
        )}
      </FormattedMessage>
      <FormattedMessage id="Password">
        {placeholder => (
          <Input className="H-24 MT-12" placeholder={placeholder} type="password" size="large" value={password} onChange={e => setPassword(e.target.value)} />
        )}
      </FormattedMessage>
      <FormattedMessage id="Confirm Password">
        {placeholder => (
          <Input
            className="H-24 MT-12"
            placeholder={placeholder}
            type="password"
            size="large"
            value={passwordConfirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
          />
        )}
      </FormattedMessage>
      <div className="MT-22">
        <Button
          type="primary"
          size="large"
          style={{ width: '100%', height: 48 }}
          loading={loading}
          onClick={e => {
            setLoading(true)
            e.preventDefault()
            signup({ email: username, password, password_confirmation: passwordConfirmation })
          }}
        >
          {T('Signup')}
        </Button>
      </div>
    </FormUnderNavLayout>
  )
}

export default Signup
