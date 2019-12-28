import React from 'react'
import { useMediaQuery } from 'react-responsive'

export default React.forwardRef(({ name, ext = 'png', ...props }, ref) => {
  if (!process.browser) return null
  const xs = useMediaQuery({ query: '(max-width: 576px)' })
  const sm = useMediaQuery({ query: '(min-width: 576px)' })
  const md = useMediaQuery({ query: '(min-width: 768px)' })
  const lg = useMediaQuery({ query: '(min-width: 992px)' })
  const xl = useMediaQuery({ query: '(min-width: 1200px)' })
  const xll = useMediaQuery({ query: '(min-width: 1600px)' })
  let x
  console.info(xll, xl, lg)
  switch (true) {
    case xll:
    case xl:
    case lg:
      x = '@2x'
      break
    case md:
    case sm:
    case xs:
      x = ''
      break
    default:
      x = ''
  }
  console.info(`/static/imgs/${name}${x}.${ext}`)
  return <img alt="loading..." src={`/static/imgs/${name}${x}.${ext}`} ref={ref} {...props} />
})
