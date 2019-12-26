import React from 'react'
import { useSelector } from 'react-redux'
import { List, Button, Avatar } from 'antd'
import { Remarkable } from 'remarkable'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const md = new Remarkable({
  breaks: true,
  langPrefix: 'language-',
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (err) {
        console.error(err)
      }
    }

    try {
      return hljs.highlightAuto(str).value
    } catch (err) {
      console.error(err)
    }

    return '' // use external default escaping
  }
})

const Vote = ({ avatars, subscription, data: { title, choices }, id, room_id }) => {
  const state = useSelector(s => s)
  return (
    <List
      header={<div>{title}</div>}
      footer={<div>请投出您宝贵的一票</div>}
      bordered
      dataSource={choices}
      renderItem={([text, votedUsers], index) => (
        <List.Item>
          {text}
          {votedUsers.map(userId => (
            <Avatar key={userId} size="small" src={avatars[userId]} />
          ))}
          <Button
            type="secondary"
            shape="circle"
            icon="like"
            size="small"
            className="ML-2"
            onClick={() => {
              subscription.perform('load', {
                path: 'vote',
                data: {
                  message_id: id,
                  room_id,
                  index
                }
              })
            }}
          />
        </List.Item>
      )}
    />
  )
}

export default ({ message, subscription, avatars }) => {
  if (message.getIn(['data', 'type']) === 'vote') {
    return <Vote subscription={subscription} avatars={avatars} {...message.toJS()} />
  }
  return <div dangerouslySetInnerHTML={{ __html: md.render(message.get('text')) }} />
}
