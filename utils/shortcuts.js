import Mousetrap from 'mousetrap'

export default () => {
  Mousetrap.bind('esc l', () => {
    localStorage.setItem('resolveByLocal', true)
    window.location.reload()
  })
  Mousetrap.bind('esc r', () => {
    localStorage.setItem('resolveByLocal', false)
    window.location.reload()
  })
  Mousetrap.bind('esc s', () => {
    localStorage.setItem('resolveByLocal', false)
    window.location.reload()
  })
}
