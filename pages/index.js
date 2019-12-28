import React from 'react'
import { Button, Carousel, Row, Col } from 'antd'
import Router from 'next/router'
import Nav from '../components/nav'

const w = 'static/imgs/world.png'
const d = 'static/imgs/deploy.png'
const s = 'static/imgs/switch.png'

const LandingPage = () => {
  const grid = {
    xs: {
      span: 24
    },
    md: {
      offset: 3,
      span: 18
    }
  }
  return (
    <div style={{ background: '#282D3C' }}>
      {props => console.info(props)}
      <div className="index-bg">
        <Row>
          <Col {...grid}>
            <Col span={12}>
              <div className="name">Pangu.js</div>
              <div className="slogan">React fullstack starter kit focusing on realtime app</div>
              <div className="actions">
                <Button type="primary" onClick={() => Router.push('/signup')}>
                  Get Started
                </Button>
                <Button type="secondary" className="ML-20" onClick={() => window.open('https://github.com/ruilisi/pangu.js')}>
                  GitHub
                </Button>
              </div>
            </Col>
            <Col span={12}>image</Col>
          </Col>
        </Row>
      </div>
      <style jsx>{`
        .index-bg {
          margin-top: 90px;
          text-align: center;
          background-size: cover;
          background: rgba(221, 222, 230, 1);
          background-position: center;
          height: 600px;
        }
        .index-bg :global(.ant-btn) {
          width: 220px;
          height: 64px;
          font-size: 24px;
        }
        .name {
          margin-top: 147px;
          font-size: 60px;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
        .slogan {
          margin-top: 39px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
        .actions {
          text-align: center;
          position: absolute;
          top: 346px;
        }
      `}</style>
    </div>
  )
}

const IndexPage = () => {
  return (
    <Nav>
      <LandingPage />
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
