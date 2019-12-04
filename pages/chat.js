import React from 'react'
import { Col, Input, Button, Avatar, Row, Menu, Card } from 'antd'

const Chat = () => {
  return (
    <div>
      <Col span={4} className="border-card" style={{ overflow: 'hidden' }}>
        <Card style={{ height: '90vh', overflowY: 'scroll' }} bordered={false} title={<div className="TA-C FS-10">房间列表</div>}>
          <Menu className="TA-C">
            {[
              '量子波动速读群',
              '万有引力讨论群',
              '疯狂英语学习群',
              '白宫重要领导群',
              '中东石油交易群',
              '非洲长跑报名群',
              '巴黎时装展览群',
              '泰国变性组团群',
              '韩国整容组团群',
              '量子波动速读群',
              '万有引力讨论群',
              '疯狂英语学习群',
              '白宫重要领导群',
              '中东石油交易群',
              '非洲长跑报名群',
              '巴黎时装展览群',
              '泰国变性组团群',
              '韩国整容组团群',
              '日本动作交流群'
            ].map(v => (
              <Menu.Item key={v}>{v}</Menu.Item>
            ))}
          </Menu>
        </Card>
        <div className="MT-5 TA-C">
          <Button type="primary" size="large" style={{ paddingLeft: 30, paddingRight: 30 }}>
            创建房间
          </Button>
        </div>
      </Col>
      <Col span={20} style={{ overflow: 'hidden' }}>
        <Card style={{ background: '#e1e1e1', height: '90vh', overflowY: 'scroll' }} bordered={false} title={<span className="FS-10">量子波动速读群</span>}>
          <Row>
            <Col span={1}>
              <Avatar icon="user" />
            </Col>
            <Col span={10}>
              <div>李狗蛋</div>
              <div>2023-03-03</div>
              <p className="other-text">我要参加巴黎时装周，因为我比较帅，我真TM太帅了吧，不要跟我比帅，我懒得跟你比！!</p>
            </Col>
          </Row>
          <Row>
            <Col span={10} push={13}>
              <div className="TA-R MR-5">李狗蛋</div>
              <div className="TA-R MR-5">2023-03-03</div>
              <p className="my-text">不好意思，我吴彦祖还没发话！</p>
            </Col>
            <Col span={1} push={13}>
              <Avatar icon="user" />
            </Col>
          </Row>
          <Row>
            <Col span={1}>
              <Avatar icon="user" />
            </Col>
            <Col span={10}>
              <div>李狗蛋</div>
              <div>2023-03-03</div>
              <p className="other-text">在下陈冠希，未请教？</p>
            </Col>
          </Row>
          <Row>
            <Col span={10} push={13}>
              <div className="TA-R MR-5">李狗蛋</div>
              <div className="TA-R MR-5">2023-03-03</div>
              <p className="my-text">我看你就是个捡垃圾的吧？</p>
            </Col>
            <Col span={1} push={13}>
              <Avatar icon="user" />
            </Col>
          </Row>
          <Row>
            <Col span={1}>
              <Avatar icon="user" />
            </Col>
            <Col span={10}>
              <div>李狗蛋</div>
              <div>2023-03-03</div>
              <p className="other-text">呵呵！我已经帅到你开始说胡话了</p>
            </Col>
          </Row>
          <Row>
            <Col span={10} push={13}>
              <div className="TA-R MR-5">李狗蛋</div>
              <div className="TA-R MR-5">2023-03-03</div>
              <p className="my-text">你可能从来没照过镜子？</p>
            </Col>
            <Col span={1} push={13}>
              <Avatar icon="user" />
            </Col>
          </Row>
        </Card>
        <div className="MT-5 TA-C">
          <Col span={18} push={2}>
            <Input size="large" placeholder="随便吐槽一下吧" style={{ background: '#e1e1e1' }} />
          </Col>
          <Col span={4} push={2}>
            <Button size="large" type="primary">
              发送
            </Button>
          </Col>
        </div>
      </Col>
      <style jsx global>
        {`
          .ant-menu-vertical {
            border: none;
          }
          .border-card {
            height: 100vh;
            border-right: 1px solid #000;
          }
          .my-text {
            background: #2a2a2a;
            color: white;
            padding: 10px;
            margin-right: 10px;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
          .other-text {
            background: white;
            color: black;
            padding: 10px;
            border-top-right-radius: 8px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        `}
      </style>
    </div>
  )
}

export default Chat
