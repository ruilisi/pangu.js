import React from 'react'
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

export default ({ message }) => {
  return <div dangerouslySetInnerHTML={{ __html: md.render(message.get('text')) }} />
}
