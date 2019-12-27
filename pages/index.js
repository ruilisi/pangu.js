import React from 'react'
import { Button, Carousel, Row, Col } from 'antd'
import Router from 'next/router'
import Nav from '../components/nav'

const w = 'static/imgs/world.png'
const d = 'static/imgs/deploy.png'
const s = 'static/imgs/switch.png'

const IndexPage = () => {
  return (
    <Nav>
      <div style={{ background: '#282D3C' }}>
        <div className="index-bg">
          <div className="container">
            <p className="FS-20">Pangu.js</p>
            <p className="FS-15 MB-30">Realtime interaction platform built with Next.js</p>
            <Button className="W-12 MLR-5" onClick={() => Router.push('/signup')}>
              Get Started
            </Button>
            <Button className="W-12 MLR-5" onClick={() => window.open('https://github.com/ruilisi/pangu.js')}>
              GitHub
            </Button>
          </div>
        </div>
      </div>
      <Row className="index-content container">
        <div className="TA-C MTB-20 FS-12 bold">Unique core advantages</div>
        {[
          [w, 'switching between local and remote', 'Switching'],
          [s, 'One click deployment of the client', 'Deployment'],
          [d, 'react-intl allows to switch language', 'Translation']
        ].map(v => (
          <Col sm={8} xs={24} style={{ padding: 10 }} key={v[1]}>
            <div>
              <div style={{ borderRadius: 8, boxShadow: '0px 3px 14px 1px rgba(0, 0, 0, 0.1)' }} className="TA-C">
                <div style={{ padding: 40, background: '#5F6DB0', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                  <img src={v[0]} style={{ width: '80%' }} alt="" />
                </div>
                <div style={{ padding: 10 }}>
                  <p className="FS-10 bold">{v[2]}</p>
                  <p>{v[1]}</p>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Row className="index-content container TA-C">
        <div className="TA-C MTB-20 FS-12 bold">They comment like this</div>
        <Carousel
          autoplay
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            fontSize: 30
          }}
          dots={false}
        >
          <div>This is really convenient for me, I love it so much!</div>
          <div>I have never used so good tool!</div>
          <div>If you want to be an excellent developer, please fork it!</div>
          <div>This is amazing project, damn it!</div>
        </Carousel>
      </Row>
      <Row className="index-content container TA-C">
        <div className="TA-C MTB-20 FS-12 bold">Projects Using Pangu.js</div>
        {[
          ['/static/imgs/1.png', 'https://data.lingti.io'],
          ['/static/imgs/2.png', 'https://devops.lingti.io'],
          ['/static/imgs/3.png', 'https://lingti.io'],
          ['/static/imgs/4.png', 'https://esheep.xyz']
        ].map(v => (
          <Col span={6} className="MTB-20" key={v[1]}>
            <div className="C-P" role="presentation" onClick={() => window.open(v[1])}>
              <img alt="" style={{ width: 80 }} src={v[0]} />
            </div>
          </Col>
        ))}
      </Row>
      <style jsx>
        {`
          .index-bg {
            margin-top: 90px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            background-size: cover;
            background: url(/static/imgs/index-bg.png) no-repeat;
            background-position: center;
            height: 600px;
          }
          .border-bg {
            background: url(/static/imgs/border.png) no-repeat;
            display: flex;
            align-items: center;
            width: 100%;
            height: auto;
            justify-content: center;
            margin-bottom: 20px;
          }
        `}
      </style>
    </Nav>
  )
}

export default IndexPage
