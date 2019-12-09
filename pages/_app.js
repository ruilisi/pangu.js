import React from 'react'
import { Provider } from 'react-redux'
import App from 'next/app'
import withRedux from 'next-redux-wrapper'
import { IntlProvider } from 'react-intl'
import Head from '../components/head'
import configureStore from '../redux/configureStore'
import zh from '../locale/zh.yml'
import en from '../locale/en.yml'
import 'antd/dist/antd.less'
import '../styles/main.scss'
import { getApiRoot } from '~/utils/request'
import usersChannel from '../utils/usersChannel'
import shortcuts from '../utils/shortcuts'
import DevTools from '../containers/DevTools'

const localeData = { zh, en }

class MyApp extends App {
  state = {
    locale: 'en'
  }

  static async getInitialProps({ Component, ctx }) {
    if (typeof window === 'undefined') {
      global.navigator = {}
      global.navigator.languages = {}
      global.location = {}
    }
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    return { pageProps }
  }

  setLocale(locale) {
    this.setState({ locale })
  }

  componentDidMount() {
    window.ActionCable = require('../public/action_cable')
    const { props } = this
    const { store } = props
    window.DISPATCH = store.dispatch
    window.STATE = store.getState
    shortcuts()
    getApiRoot().then(usersChannel)
    const language = localStorage.getItem('LANGUAGE')
    if (!language) {
      this.setLocale('zh')
    } else if (language !== this.state.locale) {
      this.setLocale(language)
    }

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
    const { locale } = this.state

    return (
      <IntlProvider locale={locale} messages={localeData[locale]}>
        <Provider store={store}>
          <Head />
          <div style={{ minHeight: '100vh' }}>
            <Component {...pageProps} />
          </div>
          <DevTools />
        </Provider>
      </IntlProvider>
    )
  }
}

export default withRedux(configureStore)(MyApp)
