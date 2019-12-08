import Router from 'next/router'
import { removeAuthorization, setAuthorization } from '../utils/request'
import { setAuthorized } from '../redux/modules/view'

// eslint-disable-next-line import/prefer-default-export
export const logout = () => D => {
  removeAuthorization()
  D(setAuthorized(false))
  Router.push('/')
}
