import fetch from 'isomorphic-unfetch'
import cookie from 'js-cookie'

// export const API_ROOT = 'http://localhost:88'
export const API_ROOT = 'https://limitless-falls-17517.herokuapp.com'
const DEVICE_TYPE = 'WEB'

export const setToken = token => {
  cookie.set('token', token, { expires: 3600 })
}

export const getToken = () => {
  return cookie.get('token')
}

export const clearToken = () => {
  cookie.remove('token')
}

const headers = _token => {
  return {
    Authorization: _token,
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
    setToken(res.headers.get('Authorization'))
  }
  try {
    const json = await res.json()
    if (res.status >= 400) {
      json.status = res.status
    }
    if (res.status === 401) {
      const default401Message = '登录已过期，请重新登录'
      cookie.remove('token')
      console.info(default401Message)
      if (json.error.indexOf('revoke') >= 0) {
        json.error = default401Message
      }
      // createToast(json.error || default401Message)
    }
    return json
  } catch (error) {
    // skip
    return null
  }
}

export const get = async (path, data = {}, _token = '') => {
  const params = body(data)
  const query = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
  const res = await fetch(`${API_ROOT}/${path}?${query}`, {
    method: 'GET',
    headers: headers(_token)
  })
  const content = await parseResponse(res)
  return content
}

const requestMethod = method => async (path, data, _token = '') => {
  const res = await fetch(`${API_ROOT}/${path}`, {
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
