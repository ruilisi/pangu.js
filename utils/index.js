export function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export function isAndroid() {
  return /Android/i.test(navigator.userAgent)
}

export function isIPhone() {
  return /iPhone|iPad|iPod|iOS/i.test(navigator.userAgent)
}

export function isMac() {
  return /macintosh/i.test(navigator.userAgent)
}

export function isWindows() {
  return /windows|win32/i.test(navigator.userAgent)
}

export function isIE() {
  return /Edge|MSIE|trident/i.test(navigator.userAgent)
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent.toLowerCase())
}
