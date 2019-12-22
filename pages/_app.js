import React from 'react'
import { Provider } from 'react-redux'
import App from 'next/app'
import withRedux from 'next-redux-wrapper'
import { IntlProvider, addLocaleData } from 'react-intl'
import zhCN from 'react-intl/locale-data/zh'
import enUS from 'react-intl/locale-data/en'
import Head from '../components/head'
import configureStore from '../redux/configureStore'
import zh from '../locale/zh.yml'
import en from '../locale/en.yml'
import 'antd/dist/antd.less'
import '../styles/main.scss'
import { getApiRoot, get } from '~/utils/request'
import usersChannel from '../utils/usersChannel'
import shortcuts from '../utils/shortcuts'
import { viewSetIn } from '%view'

const localeData = { zh, en }
addLocaleData([...zhCN, ...enUS])

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
    const { props } = this
    const { store } = props
    window.DISPATCH = store.dispatch
    window.STATE = store.getState
    shortcuts()
    getApiRoot().then(() => {
      get('data').then(data => store.dispatch(viewSetIn('data', data)))
      usersChannel()
    })
    const language = localStorage.getItem('LANGUAGE')
    if (!language) {
      this.setLocale('zh')
    } else if (language !== this.state.locale) {
      this.setLocale(language)
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
        </Provider>
      </IntlProvider>
    )
  }
}

export default withRedux(configureStore)(MyApp)
