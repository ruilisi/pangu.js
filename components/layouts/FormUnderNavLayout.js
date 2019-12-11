import React from 'react'
import { Row, Card, Col } from 'antd'
import Nav from '../nav'

const FormUnderNavLayout = ({ children, title }) => (
  <Nav>
    <Row style={{ marginTop: 200 }} className="container">
      <Col xs={24} sm={{ offset: 6, span: 12 }} md={{ offset: 7, span: 10 }}>
        <Card style={{ padding: 30, background: 'linear-gradient(to bottom, #304352, #d7d2cc)' }}>
          <div className="MB-10 FS-15 TA-C" style={{ color: 'white' }}>
            {title}
          </div>
          {children}
        </Card>
      </Col>
    </Row>
  </Nav>
)

export default FormUnderNavLayout
