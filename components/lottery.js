import React, { useState } from 'react'
import { InputNumber, Button, Row, Col, Input } from 'antd'

const prize = (name, count, content) => {
  return { name, count, content }
}

const Lottery = ({ submit }) => {
  const [editable, setEditable] = useState(false)
  const [gold, setGold] = useState('一等奖')
  const [silver, setSilver] = useState('二等奖')
  const [bronze, setBronze] = useState('三等奖')
  const [goldCount, setGoldCount] = useState(0)
  const [silverCount, setSilverCount] = useState(0)
  const [bronzeCount, setBronzeCount] = useState(0)
  const [goldContent, setGoldContent] = useState()
  const [silverContent, setSilverContent] = useState()
  const [bronzeContent, setBronzeContent] = useState()

  return (
    <Row className="MT-10">
      <Row>
        <div>
          <Input value={gold} onChange={e => setGold(e.target.value)} disabled={!editable} style={{ width: gold.length * 25 }} className="MTB-5 input-style" />
          <i className="iconfont icon-edit ML-5 C-P" role="presentation" onClick={() => setEditable(!editable)} />
        </div>
        <Col span={15}>
          <Input.TextArea placeholder="奖项" value={goldContent} onChange={e => setGoldContent(e.target.value)} />
        </Col>
        <Col span={6} push={3}>
          <InputNumber min={0} max={100} value={goldCount} onChange={value => setGoldCount(value)} />
        </Col>
      </Row>
      <Row>
        <div>
          <Input
            value={silver}
            onChange={e => setSilver(e.target.value)}
            disabled={!editable}
            style={{ width: gold.length * 25 }}
            className="MTB-5 input-style"
          />
          <i className="iconfont icon-edit ML-5 C-P" role="presentation" onClick={() => setEditable(!editable)} />
        </div>
        <Col span={15}>
          <Input.TextArea placeholder="奖项" value={silverContent} onChange={e => setSilverContent(e.target.value)} />
        </Col>
        <Col span={6} push={3}>
          <InputNumber min={0} max={100} value={silverCount} onChange={value => setSilverCount(value)} />
        </Col>
      </Row>
      <Row>
        <div>
          <Input
            value={bronze}
            onChange={e => setBronze(e.target.value)}
            disabled={!editable}
            style={{ width: gold.length * 25 }}
            className="MTB-5 input-style"
          />
          <i className="iconfont icon-edit ML-5 C-P" role="presentation" onClick={() => setEditable(!editable)} />
        </div>
        <Col span={15}>
          <Input.TextArea placeholder="奖项" value={bronzeContent} onChange={e => setBronzeContent(e.target.value)} />
        </Col>
        <Col span={6} push={3}>
          <InputNumber min={0} max={100} value={bronzeCount} onChange={value => setBronzeCount(value)} />
        </Col>
      </Row>
      <Row className="TA-C MT-20">
        <Button
          size="large"
          type="primary"
          style={{ background: '#5f6db0', border: 0, paddingLeft: 60, paddingRight: 60 }}
          onClick={() => submit(prize(gold, goldCount, goldContent), prize(silver, silverCount, silverContent), prize(bronze, bronzeCount, bronzeContent))}
        >
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
