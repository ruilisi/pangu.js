import fetch from 'isomorphic-unfetch'
import localStorage from 'localStorage'

const API_HOST = 'http://localhost'
const DEVICE_TYPE = 'WEB'
const token = ''
export const setToken = s => {
  const S = s.replace('Bearer ', '')
  return localStorage.setItem(`Token`, S)
}

export const getToken = () => {
  return localStorage.getItem('Token')
}

export const clearToken = () => {
  return localStorage.removeItem('Token')
}

const headers = () => {
  return {
    Authorization: `Bearer ${getToken() || token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

const body = data => {
  return {
    DEVICE_TYPE,
    ORIGIN: global.location.origin,
    ...data
  }
}

const parseResponse = async res => {
  if (res.headers.get('Authorization')) {
    setToken(res.headers.get('Authorization'))
  }
  try {
    const json = await res.json()
    if (res.status >= 400) {
      json.status = res.status
    }
    return json
  } catch (error) {
    console.info('ping')
  }
  return false
}

export const get = async (path, data = {}) => {
  const params = body(data)
  const query = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
  const res = await fetch(`${API_HOST}/${path}?${query}`, {
    method: 'GET',
    headers: headers()
  })
  const content = await parseResponse(res)
  return content
}

const requestMethod = method => async (path, data) => {
  const res = await fetch(`${API_HOST}/${path}`, {
    method,
    headers: headers(),
    body: JSON.stringify(body(data))
  })
  const content = await parseResponse(res)
  return content
}

export const post = requestMethod('POST')
export const put = requestMethod('PUT')
export const httpDelete = requestMethod('DELETE')
