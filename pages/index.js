import React from 'react'
import { Col } from 'antd'

const IndexPage = () => {
  return (
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
          .slogan-text {
            text-align: left;
            font-family: Microsoft YaHei;
            color: #513c66;
            margin-top: 15vh;
          }
          @media (max-width: 768px) {
            .fs-img-parallax {
              margin-bottom: 10vh;
            }
            .slogan-text {
              margin-top: 10vh;
              text-align: center;
            }
            .support-imgs {
              height: 280px;
              margin-top: 10vh;
            }
          }
          .product-imgs {
            height: auto;
            width: 450px;
            max-width: 100%;
          }
          .icon-imgs {
            height: auto !important;
            width: 400px;
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
          @media (min-width: 1200px) {
            .slogan-margin {
              margin-top: 10vh;
              margin-bottom: 5vh;
            }
          }
        `}
      </style>
    </div>
  )
}

export default IndexPage
