import React, { useState } from 'react'
import { Upload, Button, Icon, Spin } from 'antd'

const uploadProps = {
  action: 'https://upload.qiniup.com/',
  name: 'file'
}

export default ({ token, onSuccess, keyPrefix, keyFunc = (_keyPrefix, filename) => `${_keyPrefix}-${new Date().getTime()}-${filename}` }) => {
  const [uploading, setUploading] = useState(false)
  const [filename, setFilename] = useState('')

  const handleAvatarChange = ({ file }) => {
    if (file.status === 'uploading') {
      setUploading(true)
      return
    }
    if (file.status === 'done') {
      setUploading(false)
      const {
        response: { key }
      } = file
      onSuccess(key)
    }
  }

  return (
    <Upload
      {...uploadProps}
      accept="image/*"
      showUploadList={false}
      beforeUpload={file => setFilename(file.name)}
      data={{ token, key: keyFunc(keyPrefix, filename) }}
      onChange={handleAvatarChange}
    >
      <Button>
        {uploading ? <Spin indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />} /> : <Icon type="upload" />}
        <span className="ML-2">Upload</span>
      </Button>
    </Upload>
  )
}
