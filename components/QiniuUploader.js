import * as qiniu from 'qiniu-js'
import React from 'react'
import { Upload } from 'antd'

export default ({ children, qiniuToken, onSuccess, keyPrefix = 'file' }) => {
  const uploadFile = ({ file }) => {
    const key = `${keyPrefix}_${new Date().getTime()}`
    const config = {
      useCdnDomain: true,
      region: null
    }
    const putExtra = {
      fname: '',
      params: {},
      mimeType: [] || null
    }
    const observable = qiniu.upload(file, key, qiniuToken, putExtra, config)
    observable.subscribe({
      next: result => {
        console.info(result)
      },
      error: errResult => {
        console.info(errResult)
      },
      complete: result => {
        const uploadUrl = 'http://res.paiyou.co/'
        const fileUrl = uploadUrl + key
        console.info(result)
        onSuccess(fileUrl)
      }
    })
  }

  return <Upload customRequest={uploadFile}>{children}</Upload>
}
