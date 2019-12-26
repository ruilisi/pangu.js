import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

export default () => {
  const self = useSelector(s => s.self)
  const router = useRouter()
  useEffect(() => {
    if (self.get('id')) {
      router.push(`/client/${self.get('id')}`)
    }
  })
  return null
}
