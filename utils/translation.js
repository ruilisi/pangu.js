import React from 'react'
import { FormattedMessage } from 'react-intl'

export const T = message => <FormattedMessage id={message} defaultMessage={message} />
export const TR = (message, fn = x => x) => <FormattedMessage id={message}>{txt => fn(txt)}</FormattedMessage>
export const TV = (message, values) => <FormattedMessage id={message} defaultMessage={message} values={values} />
export const TH = (message, intl) => {
  return intl.formatMessage({ id: message })
}
