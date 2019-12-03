import React from 'react'
import { Provider } from 'react-redux'
import localStorage from 'localStorage'
import App from 'next/app'
import withRedux from 'next-redux-wrapper'
import { IntlProvider } from 'react-intl'
import Head from '../components/head'
import Nav from '../components/nav'
import createStore from '../redux/createStore'
import zh from '../locale/zh.yml'
import en from '../locale/en.yml'
import 'antd/dist/antd.less'
import '../styles/main.scss'

const localeData = { zh, en }

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    if (typeof window === 'undefined') {
      global.navigator = {}
      global.navigator.languages = {}
      global.location = {}
    }
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    return { pageProps }
  }

  componentDidMount() {
    if (navigator.userAgent.indexOf('MicroMessenger') >= 0 && navigator.userAgent.indexOf('Android') >= 0) {
      delete global.Intl
    }
    if (!global.Intl) {
      require.ensure(['intl', 'intl/locale-data/jsonp/en.js'], require => {
        require('intl')
        require('intl/locale-data/jsonp/en.js')
      })
    }
  }

  render() {
    const { Component, pageProps, store } = this.props
    let navigatorLanguage = 'zh'
    if (global.navigator.language !== 'zh-CN' && global.navigator.language !== undefined) {
      navigatorLanguage = 'en'
    }
    const locale = localStorage.getItem('LANGUAGE') || navigatorLanguage

    return (
      <IntlProvider locale={locale} messages={localeData[locale]}>
        <Provider store={store}>
          <Head />
          <Nav />
          <div style={{ minHeight: '100vh' }}>
            <Component {...pageProps} />
          </div>
        </Provider>
      </IntlProvider>
    )
  }
}

export default withRedux(createStore)(MyApp)
