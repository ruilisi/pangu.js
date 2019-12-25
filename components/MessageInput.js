import React, { useState, useEffect } from 'react'
import { Picker } from 'emoji-mart'
import { Button, Input, Popover } from 'antd'
import fetch from 'isomorphic-unfetch'
import { get } from '../utils/request'

export default ({ defaultText, onSend, roomId, subscription }) => {
  const [text, setText] = useState(defaultText)
  const [cursorStart, setCursorStart] = useState(0)
  const [token, setToken] = useState(0)
  useEffect(() => {
    get('qiniu_token').then(data => {
      setToken(data.qiniuToken)
    })
  }, [])

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (text.trim() === '') return
      if (onSend) {
        onSend(text)
      }
      setText('')
      e.preventDefault()
    }
  }

  const upload = file => {
    const formData = new FormData()
    formData.append('key', `screenshot-${new Date().getTime()}-${file.name}`)
    formData.append('token', token)
    formData.append('file', file)

    fetch('https://upload.qiniup.com/', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(body => {
        if (body.key) {
          subscription.perform('load', { path: 'add_message', data: { room_id: roomId, text: `![pic](http://res.paiyou.co/${body.key})` } })
        } else {
          console.info(body.error)
        }
      })
      .catch(error => console.info(error))
  }

  return (
    <div className="TA-C bottom-input">
      <Popover content="emoji" trigger="hover" style={{ width: 100 }}>
        <Popover
          content={
            <Picker
              sheetSize={32}
              onClick={emoji => {
                const t = text.substring(0, cursorStart) + emoji.native + text.substring(cursorStart, text.length)
                setText(t)
                setCursorStart(cursorStart + 2)
              }}
            />
          }
          trigger="click"
          style={{ width: 100 }}
        >
          <Button icon="smile" />
        </Popover>
      </Popover>
      <Input.TextArea
        value={text}
        autoSize={{ minRows: 1, maxRows: 10 }}
        placeholder="随便吐槽一下吧"
        style={{ background: '#ffffff', width: '100%', margin: '30px 20px' }}
        onChange={e => {
          setText(e.target.value)
        }}
        onKeyDown={onKeyDown}
        onKeyUp={e => setCursorStart(e.target.selectionStart)}
        onClick={e => setCursorStart(e.target.selectionStart)}
        onPaste={e => {
          const { items } = e.clipboardData
          items.forEach(item => {
            if (item.kind === 'file' && item.type === 'image/png') {
              upload(item.getAsFile())
              e.preventDefault()
            }
          })
        }}
      />

      <style jsx>
        {`
          .bottom-input {
            height: auto;
            width: 100%;
            display: flex;
            align-items: center;
            background: #e9f5fa;
          }
        `}
      </style>
    </div>
  )
}
