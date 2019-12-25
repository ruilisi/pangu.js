import React, { useState } from 'react'
import { Picker } from 'emoji-mart'
import { Button, Input, Popover } from 'antd'

export default ({ defaultText, onSend }) => {
  const [text, setText] = useState(defaultText)
  const [cursorStart, setCursorStart] = useState(0)

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
