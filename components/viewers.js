import React from 'react'
import { Button, Row, Col } from 'antd'

const Lottery = ({ prizes }) => {
  let gold = {}
  let silver = {}
  let bronze = {}
  prizes.map(v => {
    switch (v.level) {
      case 'gold':
        gold = v
        break
      case 'silver':
        silver = v
        break
      case 'bronze':
        bronze = v
        break
      default:
    }
    return undefined
  })
  return (
    <Row className="MT-10">
      <Row>
        <div style={{ width: gold.name.length * 25 }} className="MTB-5">
          {gold.name}
        </div>
        <Col span={15} style={{ color: 'grey', fontSize: 12 }}>
          {gold.content}
        </Col>
        <Col span={6} push={3}>
          {gold.count}
        </Col>
      </Row>
      <Row>
        <div style={{ width: silver.name.length * 25 }} className="MTB-5">
          {silver.name}
        </div>
        <Col span={15} style={{ color: 'grey', fontSize: 12 }}>
          {silver.content}
        </Col>
        <Col span={6} push={3}>
          {silver.count}
        </Col>
      </Row>
      <Row>
        <div style={{ width: bronze.name.length * 25 }} className="MTB-5">
          {bronze.name}
        </div>
        <Col span={15} style={{ color: 'grey', fontSize: 12 }}>
          {bronze.content}
        </Col>
        <Col span={6} push={3}>
          {bronze.count}
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
