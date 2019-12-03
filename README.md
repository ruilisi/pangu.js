# Nextjs Pangu

## Nextjs Pangu基于Nextjs提供了一个简单易用的JS框架，其在网页性能优化和SEO方面都有一些可取之处。

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
2、SEO信息可配置：每个子页面支持SEO信息可配置，项目是为了利于SEO做的服务端渲染，需要设置html文档里的head信息。这里有三个非常关键的信息，keywords | description | title分别表示当前网页的关键字，描述和标题。
搜索引擎会根据这几个标签里的内容爬取网页的关键信息，然后用户在搜索的时候根据这些关键字匹配程度做搜索结果页面展现。
（当然展现算法远远不止参考这些信息，页面标签的语意化，关键字密度，外链，内链，访问量，用户停留时间...）

3、实现服务端渲染：SSR让你永久告别菊花圈。

4、路由美化：在pages文件夹下每个*.js 文件将变成一个路由，自动处理和渲染，这样的路由简洁明了，再也不会有同事乱放文件了。

5、引入了Redux，实现全局状态的存储和使用

6、适配IE9、10、11，大大提高了网站的浏览器兼容性，解决了IE适配的疑难杂症，让老爷机也能发光发热。

7、国际化：使用react-intl实现网页和antd的国际化，从而与国际接轨。

总的来说，Nextjs Pangu能够让初学者也能够轻松使用，因为它足够简单，开箱即用。
