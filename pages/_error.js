import React from 'react'
import { Button, Result } from 'antd'
import Router from 'next/router'
import { TR } from '../utils/translation'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : ''
    return { statusCode }
  }

  render() {
    const { statusCode } = this.props
    return (
      <Result
        style={{ paddingTop: '20vh' }}
        status={statusCode.toString() || '404'}
        title={statusCode.toString() || '404'}
        subTitle={TR('Sorry, this page is not found')}
        extra={
          <Button type="primary" onClick={() => Router.push('/')}>
            {TR('Back Home')}
          </Button>
        }
      />
    )
  }
}
