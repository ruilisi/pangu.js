import En from 'antd/lib/locale-provider/en_US'
import Zh from 'antd/lib/locale-provider/zh_TW'

export const SUPPORTED_LANGUAGES = ['zh', 'en']

export const LANGUAGE_NAME = {
  en: 'English',
  zh: '简体中文'
}

export const antLocales = {
  ja: 'en',
  zh: 'zh-CN'
}
export const antLanguage = {
  en: En,
  zh: Zh
}

export const HttpState = {
  UNKNOWN: 'UNKNOWN',
  REQUESTING: 'REQUESTING',
  REQUESTED: 'REQUESTED'
}
