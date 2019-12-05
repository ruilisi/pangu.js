import * as qiniu from 'qiniu-js'
import React from 'react'
import { Upload, Button, Icon } from 'antd'
import { useDispatch } from 'react-redux'
import { dataSetIn } from '../redux/modules/data'
import { put } from '../utils/request'

const uploadWrap = ({ token, name, id }) => {
  if (!id) {
    return (
      <Upload>
        <Button>
          <Icon type="upload" /> 上传
        </Button>
      </Upload>
    )
  }
  const dispatch = useDispatch()
  const uploadFile = ({ file, onSuccess }) => {
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
        console.info(result)
        onSuccess(result)
        const uploadUrl = 'http://res.paiyou.co/'
        const fileUrl = uploadUrl + key
        if (name === 'logo') {
          const submit = async () => {
            let params = {}
            params = { logo: fileUrl }
            await put(`companies/info/${id}`, params)
          }
          submit()
        }
        dispatch(dataSetIn([name], fileUrl))
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