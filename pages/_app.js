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
import { getApiRoot, getJwtToken, get } from '~/utils/request'
import shortcuts from '../utils/shortcuts'
import { Provider as ActionCableProvider } from '../contexts/ActionCableContext'
import UsersConsumer from '../consumers/UsersConsumer'
import { checkAuthorization, viewSetIn } from '../redux/modules/view'

const localeData = { zh, en }

class MyApp extends App {
  state = {
    locale: 'en',
    actionCableUrl: '',
    actionCableJwtToken: ''
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
    const {
      props: {
        store: { dispatch, getState }
      }
    } = this
    checkAuthorization(this.props)
    window.DISPATCH = dispatch
    window.STATE = getState
    shortcuts()
    this.setState({ actionCableJwtToken: getJwtToken() })
    getApiRoot().then(apiRoot => {
      this.setState({
        actionCableUrl: `${apiRoot}/cable`
      })
      get('data').then(data => dispatch(viewSetIn('data', data)))
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
    const { locale, actionCableJwtToken, actionCableUrl } = this.state

    return (
      <IntlProvider locale={locale} messages={localeData[locale]}>
        <ActionCableProvider url={actionCableUrl} jwtToken={actionCableJwtToken}>
          <Provider store={store}>
            <Head />
            <div style={{ minHeight: '100vh' }}>
              <Component {...pageProps} />
            </div>
          </Provider>
          <UsersConsumer />
        </ActionCableProvider>
      </IntlProvider>
    )
  }
}

export default withRedux(configureStore)(MyApp)
