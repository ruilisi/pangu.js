import React from 'react'
import { useSelector } from 'react-redux'

export default () => {
  const self = useSelector(s => s.self)
  console.info(self.toJS())
  return <div>hello world</div>
}
