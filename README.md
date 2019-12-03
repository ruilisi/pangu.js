# Nextjs Pangu

## Nextjs Pangu基于Nextjs提供了一个简单易用的JS框架

该框架实现以下几点：

1、SEO友好：利于搜索引起爬取页面信息

```
import React from 'react'
import NextHead from 'next/head'

const Head = () => (
  <NextHead>
  <meta charSet="UTF-8" />
  <title>Nextjs-Pangu</title>
  <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="keywords" content="Nextjs-Pangu" />
  <meta name="description" content="Nextjs-Pangu" />
  <link rel="icon" href="/static/favicon.ico" />
  </NextHead>
)

export default Head

```
2、SEO信息可配置：每个子页面支持SEO信息可配置

3、实现服务端渲染

4、路由美化：通过自定义服务端路由实现路由自定义美化功能

5、在pages文件夹下每个*.js 文件将变成一个路由，自动处理和渲染
 
6、引入了Redux，实现全局状态的存储和使用

7、适配IE9、10、11，大大提高了网站的浏览器兼容性

8、国际化
