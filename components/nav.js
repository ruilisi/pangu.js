import React from 'react'
import { Icon, Button, Dropdown, Menu, Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import localStorage from 'localStorage'
import Router from 'next/router'
import Login from './login'
import Signup from './signup'
import { T } from '../utils/translation'
import { viewSetIn } from '../redux/modules/view'
import { logout } from '../http/self'
import { LANGUAGE_NAME, SUPPORTED_LANGUAGES } from '../consts'
import { getToken } from '../utils/request'

const setLanguage = l => {
  localStorage.setItem('LANGUAGE', l)
  window.location.reload()
}

const navigatorLanguage = () => {
  let l = 'zh'
  if (global.navigator.language !== 'zh-CN' && global.navigator.language !== undefined) {
    l = 'en'
  }
  return l
}

const Nav = ({ children }) => {
  const view = useSelector(state => state.view)
  const dispatch = useDispatch()
  const PathFromPathname = pathname => {
    let path = pathname || ''
    if (path.length > 0 && path[0] === '/') {
      path = path.substr(1)
    }
    return path
  }

  const i18nMenuHorizontal = pathname => {
    const path = PathFromPathname(pathname)
    return (
      <li className="dropdown mega-menu">
        <Link href={`/${path}`}>
          <a data-toggle="dropdown" style={{ color: 'white' }}>
            <Icon type="global" className="MR-2" />
            {LANGUAGE_NAME[localStorage.getItem('LANGUAGE') || navigatorLanguage()]}
            <Icon type="down" />
          </a>
        </Link>
        <ul className="dropdown-menu">
          <li>
            <ul className="no-bullet">
              {SUPPORTED_LANGUAGES.map(v => (
                <li key={v} className="MTB-8">
                  <span style={{ color: 'white' }} id="language" role="presentation" className="C-P ML-2" onClick={() => setLanguage(v)}>
                    {LANGUAGE_NAME[v]}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </li>
    )
  }

  const i18nRightMenu = () => {
    const menu = (
      <Menu>
        {SUPPORTED_LANGUAGES.map(v => (
          <Menu.Item key={v} className="MTB-5">
            <span role="presentation" className="C-P ML-2" onClick={() => setLanguage(v)}>
              {LANGUAGE_NAME[v]}
            </span>
          </Menu.Item>
        ))}
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a style={{ textDecoration: 'none', color: 'white' }}>
          <Icon className="dropdown" type="global" style={{ fontSize: 20, color: 'white' }} />
        </a>
      </Dropdown>
    )
  }

  const rightIconMenuNotLoggedIn = () => {
    const menu = (
      <Menu>
        <Menu.Item>
          <span role="presentation" onClick={() => dispatch(viewSetIn(['loginDialogOpen'], true))}>
            {T('Login')}
          </span>
        </Menu.Item>
        <Menu.Item>
          <span role="presentation" onClick={() => dispatch(viewSetIn(['signupDialogOpen'], true))}>
            {T('Signup')}
          </span>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a style={{ textDecoration: 'none' }}>
          <Icon type="menu" style={{ fontSize: 20, color: 'white' }} />
        </a>
      </Dropdown>
    )
  }

  const horizontalMenuNotLoggedIn = () => {
    return (
      <ul className="nav navbar-nav bold">
        {i18nMenuHorizontal()}
        <li className="mega-menu">
          <a>
            <span role="presentation" onClick={() => dispatch(viewSetIn(['loginDialogOpen'], true))}>
              {T('Login')}
            </span>
          </a>
        </li>
        <li className="mega-menu">
          <a>
            <Button type="primary" className="lingti-btn-primary" onClick={() => dispatch(viewSetIn(['signupDialogOpen'], true))}>
              {T('Signup')}
            </Button>
          </a>
        </li>
      </ul>
    )
  }

  const horizontalMenuLoggedIn = () => {
    return (
      <ul className="nav navbar-nav bold">
        {i18nMenuHorizontal()}
        <li className="mega-menu">
          <Link href="/chat">
            <a className="C-P underline">{T('Chat')}</a>
          </Link>
        </li>
        <li className="mega-menu">
          <a>
            <span className="C-P" role="presentation" onClick={() => logout()}>
              {T('Logout')}
            </span>
          </a>
        </li>
      </ul>
    )
  }

  const rightIconMenuLoggedIn = () => {
    const menu = (
      <Menu>
        <Menu.Item className="MTB-5">
          <span role="presentation" onClick={() => logout()}>
            {T('Logout')}
          </span>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a style={{ textDecoration: 'none' }}>
          <Icon type="menu" style={{ fontSize: 20, color: 'white' }} />
        </a>
      </Dropdown>
    )
  }

  return (
    <div>
      <nav className="main-nav menu-light menu-sticky">
        <div className="container">
          <div className="navbar">
            <div key="1" className="ML-10">
              <div className="brand-logo C-P MT-10">
                <span role="presentation" className="navbar-brand C-P" style={{ textDecoration: 'none' }} onClick={() => Router.push('/')}>
                  <div className="logo" />
                  <span className="navbar-brandname ML-5" style={{ color: 'white', fontWeight: 'bold', verticalAlign: 'middle' }}>
                    Nextjs Pangu
                  </span>
                </span>
              </div>
            </div>
            <div className="navbar-header">
              <div className="inner-nav">
                <ul>
                  <li className="navbar-toggle">{getToken() ? rightIconMenuLoggedIn() : rightIconMenuNotLoggedIn()}</li>
                  <li className="navbar-toggle">{i18nRightMenu()}</li>
                </ul>
              </div>
            </div>
            <div className="navbar-collapse collapse inner-nav">{getToken() ? horizontalMenuLoggedIn() : horizontalMenuNotLoggedIn()}</div>
          </div>
        </div>
      </nav>
      {children}
      <Modal
        width={420}
        visible={view.getIn(['loginDialogOpen'])}
        closable={false}
        footer={null}
        onCancel={() => dispatch(viewSetIn(['loginDialogOpen'], false))}
      >
        <Login />
      </Modal>
      <Modal
        width={420}
        visible={view.getIn(['signupDialogOpen'])}
        closable={false}
        footer={null}
        onCancel={() => dispatch(viewSetIn(['signupDialogOpen'], false))}
      >
        <Signup />
      </Modal>
      <style jsx>
        {`
          .logo {
            display: inline-block;
            vertical-align: middle;
            background: url(/static/imgs/logo.jpg) no-repeat;
            background-size: cover;
            height: 50px;
            width: 50px;
          }
        `}
      </style>
    </div>
  )
}

export default Nav
