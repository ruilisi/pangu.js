import React from 'react'
import { Icon, Dropdown, Menu } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import Router from 'next/router'
import { T } from '../utils/translation'
import { authorized } from '%view'
import { LANGUAGE_NAME, SUPPORTED_LANGUAGES } from '../consts'
import { logout } from '../api/sessions'

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
  const self = useSelector(state => state.self)

  const PathFromPathname = pathname => {
    let path = pathname || ''
    if (path.length > 0 && path[0] === '/') {
      path = path.substr(1)
    }
    return path
  }

  const D = useDispatch()

  const i18nMenuHorizontal = pathname => {
    if (!process.browser) {
      return null
    }
    const path = PathFromPathname(pathname)
    return (
      <li className="dropdown mega-menu">
        <Link href={`/${path}`}>
          <a data-toggle="dropdown">
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
                  <span role="presentation" className="C-P ML-2" onClick={() => setLanguage(v)}>
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
        <a style={{ textDecoration: 'none' }}>
          <Icon className="dropdown" type="global" style={{ fontSize: 20 }} />
        </a>
      </Dropdown>
    )
  }

  const rightIconMenuNotLoggedIn = () => {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link href="/login">
            <a> {T('Login')}</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a> {T('Signup')}</a>
          </Link>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a style={{ textDecoration: 'none' }}>
          <Icon type="menu" style={{ fontSize: 20 }} />
        </a>
      </Dropdown>
    )
  }

  const horizontalMenuNotLoggedIn = () => {
    return (
      <ul className="nav navbar-nav bold">
        {i18nMenuHorizontal()}
        <li className="mega-menu">
          <Link href="/login">
            <a className="C-P underline">{T('Login')}</a>
          </Link>
        </li>
        <li className="mega-menu">
          <Link href="/signup">
            <a className="C-P underline">{T('Signup')}</a>
          </Link>
        </li>
      </ul>
    )
  }

  const horizontalMenuLoggedIn = () => {
    return (
      <ul className="nav navbar-nav bold">
        {i18nMenuHorizontal()}
        <li className="mega-menu">
          <Link href={`/client/${self.get('id')}`}>
            <a className="C-P underline">{T('Chat')}</a>
          </Link>
        </li>
        <li className="mega-menu">
          <a>
            <span className="C-P" role="presentation" onClick={() => D(logout())}>
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
        <Menu.Item>
          <Link href={`/client/${self.get('id')}`}>
            <a> {T('Chat')}</a>
          </Link>
        </Menu.Item>
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
          <Icon type="menu" style={{ fontSize: 20 }} />
        </a>
      </Dropdown>
    )
  }

  return (
    <div>
      <nav className="main-nav menu-light menu-sticky">
        <div className="container">
          <div className="navbar">
            <div className="brand-logo C-P">
              <div role="presentation" className="MT-15 navbar-brand C-P" style={{ textDecoration: 'none' }} onClick={() => Router.push('/')}>
                <div className="logo" />
                <div className="ML-5" style={{ fontWeight: 'bold' }}>
                  Pangu.js
                </div>
              </div>
            </div>
            <div className="navbar-header">
              <div className="inner-nav">
                <ul>
                  <li className="navbar-toggle">{authorized(view) === true ? rightIconMenuLoggedIn() : rightIconMenuNotLoggedIn()}</li>
                  <li className="navbar-toggle">{i18nRightMenu()}</li>
                </ul>
              </div>
            </div>
            <div className="navbar-collapse collapse inner-nav">{authorized(view) === true ? horizontalMenuLoggedIn() : horizontalMenuNotLoggedIn()}</div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

export default Nav
