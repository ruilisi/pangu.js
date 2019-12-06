import Router from 'next/router'
import { clearToken, get, API_ROOT } from './request'

export const logout = () => {
  clearToken()
  Router.push('/')
}

export const getGoods = async () => {
  const res = await get('inapp/all_goods')
  return res
}

export const getSystemData = async () => {
  const res = await get('system_data')
  return res
}

export const userInfo = async token => {
  const res = await get('user_info', {}, token)
  return res
}

export const authPing = async token => {
  const res = await fetch(`${API_ROOT}/auth_ping`, {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  const body = await res.text()
  return body
}
