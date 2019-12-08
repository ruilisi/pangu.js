import React from 'react'
import { Row, Col } from 'antd'
import Nav from '../nav'

const FormUnderNavLayout = ({ children, title }) => (
  <Nav>
    <Row className="MT-45">
      <Col xs={{ span: 24 }} sm={{ offset: 6, span: 12 }} md={{ offset: 8, span: 8 }}>
        <div className="MB-10 FS-15 TA-C">{title}</div>
        {children}
      </Col>
    </Row>
  </Nav>
)

export default FormUnderNavLayout
