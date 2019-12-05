import * as qiniu from 'qiniu-js'
import React from 'react'
import { Upload, Button, Icon } from 'antd'
import { put } from '../utils/request'

const uploadWrap = ({ token, name, id, onSuccess }) => {
  const uploadFile = ({ file }) => {
    const qiniuToken = token
    const key = `student_${new Date().getTime()}`
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
        onSuccess(fileUrl)
        if (name === 'logo') {
          const submit = async () => {
            let params = {}
            params = { logo: fileUrl }
            await put(`companies/info/${id}`, params)
          }
          submit()
        }
      }
    })
  }

  return (
    <Upload customRequest={uploadFile}>
      <Button>
        <Icon type="upload" /> 上传
      </Button>
    </Upload>
  )
}

export default uploadWrap
