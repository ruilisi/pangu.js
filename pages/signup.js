import React, { useState } from 'react'
import { message, Input, Button, Row, Col } from 'antd'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { T } from '../utils/translation'
import { viewSetIn, redirectIfAuthorized } from '../redux/modules/view'
import { post } from '../utils/request'
import Nav from '../components/nav'

const Signup = () => {
  redirectIfAuthorized('/')
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const signup = async params => {
    const res = await post('users', { user: params })
    if (res.id) {
      message.success('注册成功')
      dispatch(viewSetIn(['signupDialogOpen'], false))
    } else {
      message.error(res.message)
    }
    setLoading(false)
  }

  return (
    <div>
      <Nav />
      <Row className="MT-45">
        <Col xs={{ span: 24 }} sm={{ offset: 6, span: 12 }} md={{ offset: 8, span: 8 }}>
          <div className="MB-10 FS-15 TA-C">注册</div>
          <FormattedMessage id="Email">
            {placeholder => (
              <Input autoFocus placeholder={placeholder} size="large" className="H-21" value={username} onChange={e => setUsername(e.target.value)} />
            )}
          </FormattedMessage>
          <FormattedMessage id="Password">
            {placeholder => (
              <Input
                className="H-21 MT-12"
                placeholder={placeholder}
                type="password"
                size="large"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="Confirm Password">
            {placeholder => (
              <Input
                className="H-21 MT-12"
                placeholder={placeholder}
                type="password"
                size="large"
                value={passwordConfirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
              />
            )}
          </FormattedMessage>
          <div className="align-center MT-12">
            <Button
              type="primary"
              size="large"
              style={{ minWidth: '100%', height: 42 }}
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
        </Col>
      </Row>
    </div>
  )
}

export default Signup
