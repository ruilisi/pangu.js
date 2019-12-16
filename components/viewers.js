import React, { useState } from 'react'
import { Button, Row, Col } from 'antd'

const Lottery = () => {
  const [gold, setGold] = useState('一等奖')
  return (
    <Row className="MT-10">
      <Row>
        <div style={{ width: gold.length * 25 }} className="MTB-5">
          {gold}
        </div>
        <Col span={15} style={{ color: 'grey', fontSize: 12 }}>
          奖项
        </Col>
        <Col span={6} push={3}>
          3
        </Col>
      </Row>
      <Row>
        <div style={{ width: gold.length * 25 }} className="MTB-5">
          {gold}
        </div>
        <Col span={15} style={{ color: 'grey', fontSize: 12 }}>
          奖项
        </Col>
        <Col span={6} push={3}>
          3
        </Col>
      </Row>
      <Row>
        <div style={{ width: gold.length * 25 }} className="MTB-5">
          {gold}
        </div>
        <Col span={15} style={{ color: 'grey', fontSize: 12 }}>
          奖项
        </Col>
        <Col span={6} push={3}>
          3
        </Col>
      </Row>
      <Row className="TA-C MT-20">
        <Button size="large" type="primary" style={{ background: '#5f6db0', border: 0, paddingLeft: 60, paddingRight: 60 }}>
          立即参与
        </Button>
      </Row>
      <style jsx global>
        {`
          .ant-input[disabled] {
            background: #fff;
            border: 0;
            color: #000;
          }
        `}
      </style>
    </Row>
  )
}

export default Lottery
