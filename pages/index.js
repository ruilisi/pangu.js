import React from 'react'
import nextCookie from 'next-cookies'
import { Col } from 'antd'
import Nav from '../components/nav'

const IndexPage = ctx => {
  const { token } = nextCookie(ctx)
  console.info('toknen', token)
  return (
    <Nav>
      <div>
        <div className="fs-img-parallax">
          <div className="hero-caption caption-center caption-height-middle slogan-margin">
            <Col xl={{ span: 8, push: 4 }} md={12} xs={24}>
              <img src="/static/imgs/slogan.png" alt="" className="support-imgs" />
            </Col>
          </div>
        </div>
        <style jsx>
          {`
            .fs-img-parallax {
              position: relative;
              width: 100%;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center center;
              min-height: 100vh;
            }
            .support-imgs {
              margin-top: 5vh;
              height: auto;
              max-width: 100%;
            }
            @media (max-width: 768px) {
              .fs-img-parallax {
                margin-bottom: 10vh;
              }
              .support-imgs {
                height: 280px;
                margin-top: 10vh;
              }
            }
            .hero-caption {
              z-index: 1;
              position: absolute !important;
            }
            .hero-caption.caption-center {
              left: 0;
              right: 0;
              text-align: center;
            }
            .hero-caption.caption-height-middle {
              top: 10%;
            }
          `}
        </style>
      </div>
    </Nav>
  )
}

export default IndexPage
