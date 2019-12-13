import React, { useState } from 'react'
import { Upload, Button, Icon, Spin } from 'antd'

const uploadProps = {
  action: 'https://upload.qiniup.com/',
  name: 'file'
}

export default ({ token, onSuccess, keyPrefix = 'file' }) => {
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')

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
      onSuccess(`http://res.paiyou.co/${key}`)
    }
  }

  return (
    <Upload
      {...uploadProps}
      accept="image/*"
      showUploadList={false}
      beforeUpload={file => setName(file.name)}
      data={{ token, key: `${keyPrefix}_${new Date().getTime()}_${name}` }}
      onChange={handleAvatarChange}
    >
      <Button>
        {uploading ? <Spin indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />} /> : <Icon type="upload" />}
        <span className="ML-2">Upload</span>
      </Button>
    </Upload>
  )
}
