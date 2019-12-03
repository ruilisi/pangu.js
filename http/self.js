import Router from 'next/router'
import { clearToken, get } from '../utils/request'

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
