import React, { useState } from 'react'
import { InputNumber, Button, Row, Col, Input } from 'antd'

const Lottery = () => {
  const [editable, setEditable] = useState(false)
  const [gold, setGold] = useState('一等奖')
  return (
    <Row className="MT-10">
      <Row>
        <div>
          <Input value={gold} disabled={!editable} style={{ width: gold.length * 25 }} className="MTB-5 input-style" />
          <i className="iconfont icon-edit ML-5 C-P" role="presentation" onClick={() => setEditable(!editable)} />
        </div>
        <Col span={15}>
          <Input.TextArea placeholder="奖项" />
        </Col>
        <Col span={6} push={3}>
          <InputNumber min={1} max={10} defaultValue={3} />
        </Col>
      </Row>
      <Row>
        <div>
          <Input value={gold} disabled={!editable} style={{ width: gold.length * 25 }} className="MTB-5 input-style" />
          <i className="iconfont icon-edit ML-5 C-P" role="presentation" onClick={() => setEditable(!editable)} />
        </div>
        <Col span={15}>
          <Input.TextArea placeholder="奖项" />
        </Col>
        <Col span={6} push={3}>
          <InputNumber min={1} max={10} defaultValue={3} />
        </Col>
      </Row>
      <Row>
        <div>
          <Input value={gold} disabled={!editable} style={{ width: gold.length * 25 }} className="MTB-5 input-style" />
          <i className="iconfont icon-edit ML-5 C-P" role="presentation" onClick={() => setEditable(!editable)} />
        </div>
        <Col span={15}>
          <Input.TextArea placeholder="奖项" />
        </Col>
        <Col span={6} push={3}>
          <InputNumber min={1} max={10} defaultValue={3} />
        </Col>
      </Row>
      <Row className="TA-C MT-20">
        <Button size="large" type="primary" style={{ background: '#5f6db0', border: 0, paddingLeft: 60, paddingRight: 60 }}>
          提交
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
