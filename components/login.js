import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col, Input, Button, message } from 'antd'
import { FormattedMessage } from 'react-intl'
import { TR } from '../utils/translation'
import { viewSetIn } from '../redux/modules/view'
import { post } from '../utils/request'

const Login = () => {
  const dispatch = useDispatch()
  const [submitting, setSubmitting] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const postLogin = async params => {
    const res = await post('users/sign_in', params)
    return res
  }
  const login = async params => {
    const res = await postLogin(params)
    if (res.id) {
      message.success('登录成功')
      dispatch(viewSetIn(['loginDialogOpen'], false))
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
    <Row>
      <Col className="PTB-10 align-center">
        <Row>
          <div key="2">
            <div>
              <FormattedMessage id="Email or Mobile">
                {placeholder => (
                  <Input
                    key="1"
                    size="large"
                    type="text"
                    placeholder={placeholder}
                    autoFocus
                    className="H-21"
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
                    className="MT-12 H-21"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyPress={onKeyPress}
                  />
                )}
              </FormattedMessage>
              <div key="3" className="MT-22">
                <Button
                  className="H-21"
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
            </div>
          </div>
        </Row>
      </Col>
    </Row>
  )
}

export default Login
