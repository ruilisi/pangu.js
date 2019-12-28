import React from 'react'
import { Button, Carousel, Row, Col } from 'antd'
import Router from 'next/router'
import css from 'styled-jsx/css'
import Nav from '../components/nav'
import ResponsiveImg from '../components/ResponsiveImg'

const { className, styles } = css.resolve`
  img {
    height: 355px;
    width: 623px;
  }
  .ant-btn {
    width: 220px;
    height: 64px;
    font-size: 24px;
  }
`

const IntroSec = () => {
  const grid = {
    xs: {
      span: 24
    },
    md: {
      offset: 4,
      span: 16
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
                <Button type="primary" onClick={() => window.open('https://pangu.ruilisi.co')} className={className}>
                  DEMO
                </Button>
                <Button type="secondary" onClick={() => window.open('https://github.com/ruilisi/pangu.js')} className={`${className} ML-20`}>
                  GitHub
                </Button>
              </div>
            </Col>
            <Col span={12}>
              <ResponsiveImg name="newton-cradle" className={className} />
            </Col>
          </Col>
        </Row>
      </div>
      <style jsx>{`
        .index-bg {
          margin-top: 90px;
          background-size: cover;
          background: rgba(221, 222, 230, 1);
          background-position: center;
        }
        .index-bg :global(.ant-btn) {
          width: 220px;
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
          margin-top: 79px;
          margin-bottom: 140px;
          width: 100%;
          top: 346px;
        }
      `}</style>
      {styles}
    </div>
  )
}

const IndexPage = () => {
  return (
    <Nav>
      <IntroSec />
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
    </Nav>
  )
}

export default IndexPage
