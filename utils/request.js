import fetch from 'isomorphic-unfetch'
import dns from './dns'

const DEVICE_TYPE = 'WEB'
const authorizationKey = 'AUTHORIZATION'

export const testApiRoot = async rootUrl => {
  const response = await fetch(`${rootUrl}/ping`)
  const { ok, status } = response
  if (ok && status === 200) {
    const text = await response.text()
    if (text === 'pong') {
      return rootUrl
    }
    return Promise.reject()
  }
  return Promise.reject(new Error(`ok: ${ok}, status: ${status}`))
}

export const setApiRoot = async newApiRoot => {
  dns.API_ROOT = newApiRoot
  localStorage.setItem('API_ROOT', newApiRoot)
  return newApiRoot
}

export const getApiRootByRacing = async () => {
  try {
    const newApiRoot = await Promise.race(dns.REMOTE_HOSTS.map(testApiRoot))
    return setApiRoot(newApiRoot)
  } catch (error) {
    const msg = `Failed to ping any remote: ${error}`
    return Promise.reject(new Error(msg))
  }
}

export const getApiRoot = async () => {
  if (localStorage.getItem('resolveByLocal') === 'true') {
    return setApiRoot(dns.API_ROOT_LOCAL)
  }
  // return getApiRootByRacing()
  return setApiRoot(dns.API_ROOT_REMOTE)
}

export const getAuthorization = () => {
  return localStorage.getItem(authorizationKey)
}

export const setAuthorization = s => {
  localStorage.setItem(authorizationKey, s)
}

export const getJwtToken = () => (getAuthorization() || '').split(' ')[1]

export const removeAuthorization = () => {
  localStorage.removeItem(authorizationKey)
}

const headers = () => {
  return {
    Authorization: getAuthorization(),
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

const body = data => {
  return {
    DEVICE_TYPE,
    ...data
  }
}

const parseResponse = async res => {
  if (res.headers.get('Authorization')) {
    setAuthorization(res.headers.get('Authorization'))
  }
  const json = await res.json()
  if (res.status >= 400) {
    json.status = res.status
  }
  if (res.status === 401) {
    removeAuthorization()
  }
  return json
}

export const get = async (path, data = {}, _token = '') => {
  const params = body(data)
  const query = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
  const res = await fetch(`${dns.API_ROOT}/${path}?${query}`, {
    method: 'GET',
    headers: headers(_token)
  })
  const content = await parseResponse(res)
  return content
}

const requestMethod = method => async (path, data, _token = '') => {
  const res = await fetch(`${dns.API_ROOT}/${path}`, {
    method,
    headers: headers(_token),
    body: JSON.stringify(body(data))
  })
  const content = await parseResponse(res)
  return content
}

export const post = requestMethod('POST')
export const put = requestMethod('PUT')
export const httpDelete = requestMethod('DELETE')
