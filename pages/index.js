import React from 'react'
import { Button, Row, Col } from 'antd'
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
          <div>
            <p>NextJS Pangu</p>
            <p>This is really an amazing website , Come and join us !</p>
            <Button className="W-12 MLR-5" onClick={() => Router.push('/signup')}>
              Get Started
            </Button>
            <Button className="W-12 MLR-5" onClick={() => window.open('https://github.com/paiyou-network/nextjs-pangu')}>
              GitHub
            </Button>
          </div>
        </div>
      </div>
      <Row className="index-content container">
        <div className="TA-C MTB-20 FS-20 bold">Unique core advantages</div>
        {[
          [w, 'switching between local and remote', 'Free switching'],
          [s, 'One click deployment of the client', 'One-click deployment'],
          [d, 'react-intl allows to switch language', 'Globalization']
        ].map(v => (
          <Col md={8} style={{ padding: 10 }}>
            <div>
              <div style={{ padding: 40, background: '#5F6DB0', border: '1px solid #000' }} className="TA-C">
                <img src={v[0]} style={{ width: '80%' }} alt="" />
              </div>
              <div style={{ border: '1px solid #000', padding: 20 }}>
                <p className="FS-10 bold">{v[2]}</p>
                <p>{v[1]}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Row className="index-content container TA-C">
        <div className="TA-C MTB-20 FS-20 bold">They comment like this</div>
        {/* }<Carousel autoplay style={{ marginBottom: 40 }} dots={false}>
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>This is really convenient for me, I love it so much!</div>
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>This is I love it so much!</div>
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>me, I love it so much!</div>
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>I love it so much!</div>
        </Carousel>
        */}
      </Row>
      <style jsx>
        {`
          .index-bg {
            margin-top: 90px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
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
