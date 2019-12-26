import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

const routeAuthorizedMap = [
  [/^\/profile/, true],
  [/^\/client/, true],
  [/^\/login/, false],
  [/^\/signup/, false]
]

const authorizedPath = ['login', 'authorized']
const authorized = view => view.getIn(authorizedPath)

const CheckLogin = () => {
  const router = useRouter()
  const view = useSelector(s => s.view)
  useEffect(() => {
    const result = routeAuthorizedMap.find(([routeRegex]) => routeRegex.test(router.route))
    if (result) {
      const [, requireAuthorized] = result
      if (!requireAuthorized === authorized(view)) {
        if (requireAuthorized) {
          router.push('/login')
        } else {
          router.push('/profile')
        }
      }
    }
  })
  return null
}

export default CheckLogin
