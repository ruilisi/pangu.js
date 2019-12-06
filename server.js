// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fetch = require('isomorphic-unfetch')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const authPing = async token => {
  const res = await fetch('https://limitless-falls-17517.herokuapp.com/auth_ping', {
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

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl
    console.info(pathname)
    console.info(req.cookies)
    const checkLoginState = (okPath, failPath) => {
      let token = ''
      if (req.headers.cookie) {
        token = decodeURI(req.headers.cookie.split('token=')[req.headers.cookie.split('token=').length - 1])
      }
      authPing(token).then(body => {
        if (body === 'pong') {
          app.render(req, res, okPath, query)
        } else {
          app.render(req, res, failPath, query)
        }
      })
    }

    if (pathname === '/chat') {
      checkLoginState('/', '/')
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
