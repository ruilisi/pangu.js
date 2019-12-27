# Next.js-pangu

[英文文档 English document](/README.md)

`pangu.js`是一个前端javascript入门工具包，它继承自[Next.js](https://github.com/zeit/next.js/)，并且非常依赖[Rails-pangu](https://github.com/ruilisi/rails-pangu)。其致力于成为`Next.js`应用的精简示例，同时处理`Next.js`尚未解决或不想解决的遗留问题。(比如，`Next.js`对于`IE9`的不支持问题)由于`pangu.js`与`Rails`后端紧密连接，因此该项目还提供了用于进行后端工作的示例和解决方案，例如，与[action cable](https://github.com/rails/rails/tree/master/actioncable)进行连接操作并通过`jwt`验证该连接。



## 特征

#### 服务器渲染

`Next.js`可以使React的服务器端渲染变得简单。

#### 静态导出

无需学习新语言，Next.js可以很方便快捷的导出静态站点。

#### CSS-in-JS

Next.js附带了styled-jsx，但它也可以与您熟悉和喜爱的每个CSS-in-JS解决方案一起使用。

#### 无需安装包

实现代码的自动拆分，基于文件系统的路由，代码热重载，统一渲染。

#### 完整的可扩展性

拥有对于Babel和Webpack的完全控制权限，并且自带可定制的服务器，路由和next-plugins

#### Ready for Production

针对build的package的大小，以及其他许多地方进行了优化。

#### Actioncable

提供了[action_cable.js](./action_cable.js)的改进版本，并且该版本支持`jwt`身份验证。这一奇妙操作仅仅是通过将`jwt`添加到websocket请求头文件中的`Sec-WebSocket-Protocol` 来实现。

#### CSS 简写

我们采用`Next.js`之后，它对CSS / Sass / Less / Stylus的支持，为我们自由添加CSS样式提供了很大的便利。

```js
:global {
  .example {
    font-size: 20px;
  }
}

export default () => <div className="example">Example</div>
```

除此之外，我们还增加了对于变量的支持，例如：

```js
@mixin number-classes() {
  @for $i from 1 through 50 {
    .FS-#{$i} {
      font-size: 2px * $i;
    }
  }
}

export default () => <div className="FS-10">Example</div>
```

#### 支持IE11，IE10，IE9

由于`IE`内核的问题，导致其对新的js / css语法的支持不佳，`IE`正逐渐从浏览器世界中消失，但是`IE`系列仍然占有巨大的浏览器市场。

来自[netmarketshare](https://gs.statcounter.com/browser-market-share/desktop/worldwide)的数据显示，在编写此README时（2019年12月7日），`IE`系列仍然占整个台式机市场的3.67％。 

<img src="./doc/desktop-browser-market-share.png" width="60%" align="middle" />

也就是说，每100个人中将有超过3个人无法访问由`Next.js`建立的网站，毫无疑问，这对于大多数Web项目是无法容忍的。

用`Next.js`构建的项目不支持`IE9-11`的原因主要是:

- `IE9-11`中不包含`Objects`（`Map`，`String`，`Array`）函数，但是有些library或代码却使用了Object函数。我们提供`lib/polyfill.js`文件来解决此问题。

- Node modules包含了IE无法识别并且polyfill无法修复的语法，例如，箭头函数`=>`。我们解决此问题的方案实际上很hacky(欢迎任何更好的解决方案作为我们的`PR`)，我们将文件添加到`next.config.js`中的monkey补丁程序，并把文件重新编译为`Next.js`的 [webpack config](https://github.com/zeit/next.js/blob/master/packages/next/build/webpack-config.ts) 。如果以后添加的任何Node modules都与` IE 9-11`产生冲突，则可以通过添加以下代码的路径来实现相同的目的。

- ```js
  if (!isDev) {
    const moduleToBeResolved = /node_modules[\\\/](bizcharts|react-intl|intl-messageformat|intl-messageformat-parser|query-string|split-on-first|engine.io-client|strict-uri-encode)[\\\/]/
    config.module.rules[0].include.push(/(browser|common)\.js/, moduleToBeResolved)
    config.module.rules[0].exclude = path => {
      if (
        /next[\\/]dist[\\/]next-server[\\/]lib/.test(path) ||
        /next[\\/]dist[\\/]client/.test(path) ||
        /next[\\/]dist[\\/]pages/.test(path) ||
        /[\\/](strip-ansi|ansi-regex)[\\/]/.test(path) ||
        /(browser|common)\.js/.test(path)
      ) {
        return false
      }
      if (/node_modules/.test(path)) {
        return !moduleToBeResolved.test(path)
      }
    }
  }
  ```


#### [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)

#### [shortcuts.js](./utils/shortcuts.js)快捷键

- 在本地/远程API服务器之间切换
  - 通过`esc l`，页面将重新加载，并且前端将使用`API_ROOT_LOCAL`作为本地api主机。
  - 通过`esc r`，页面将被重新加载，前端将通过` ping`每个远程主机来找出` REMOTE_HOSTS`中最好的远程api主机，然后使用它。

## 快速开始

- 虽然此项目是使用Nodejs` v12.1.0`开发的，但是您可以尝试任何可用的Nodejs版本。
- 运行 `yarn` => `yarn dev`.

## 部署

附加了[Dockerfile](./Dockerfile) 来构建这个项目，并运行`bin/build.sh`来构建它。

## 包含的JavaScript库

#### `react-intl`

这个library提供了React组件和一个API，用于格式化日期，数字和字符串，包括复数形式和处理翻译。

注意：新版本的formatjs源代码调用了一些新的API，但是每次执行这两个方法时，X5核心浏览器都会崩溃。

如果您想使用X5核心浏览器，请将react-intl降级到3.0以下。

```
<IntlProvider locale={locale} messages={localeData[locale]}>
  <Provider store={store}>
    <Head />
    <Nav />
    <div style={{ minHeight: '100vh'  }}>
      <Component {...pageProps} />
    </div>
  </Provider>
</IntlProvider>
```

#### Redux

React很棒，完全可以使用React编写一个完整的应用程序。但是，随着应用程序变得越来越复杂，有时使用普通的旧版React并不是那么简单。我们如果使用像`Redux`这样的状态管理库，就可以减少在更复杂的应用程序中出现的一些问题。

#### 附加rails-pangu并通过jwt授权的http连接

#### 附加rails-pangu并通过jwt授权的Action Cable连接(rails应用与websocket的集成)

#### babel-plugin-root-import

该模块与`eslint-import-resolver-babel-plugin-root-import`一起使用，通过使用特殊字符（例如`~~`，`％`）来替换路径，使导入长而常用的路径变得容易。以下是相关的配置代码：

```js
  plugins: [
    '@babel/plugin-transform-arrow-functions',
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: '.',
            rootPathPrefix: '~'
          },
          {
            rootPathSuffix: './redux/modules/',
            rootPathPrefix: '%'
          }
        ]
      }
    ]
  ]
  // babel.config.js

  settings: {
    'import/resolver': {
      node: {
        paths: [
          './'
        ]
      },
      'babel-plugin-root-import': [
          {
            'rootPathSuffix': '.',
            'rootPathPrefix': '~'
          },
          {
            'rootPathSuffix': './redux/modules/',
            'rootPathPrefix': '%'
          }
      ]
    }
  }
  // .eslintrc.js
```

## 一种部署方法

**[ZEIT Now](https://zeit.co/docs)** (https://zeit.co/docs) 是一个用于静态站点部署的云平台。`ZEIT Now`可以自动扩展且无需任何监管的配置网站和Web服务, 开发人员可以很方便快捷地部署网站。

`ZEIT Now`入门仅需几步，你就可以在不到一分钟的时间内启动并运行新项目。

## pangu.js的使用样例

**[样例](https://pangu.js.now.sh)** (https://pangu.js.now.sh)

在此示例中，前端使用 [pangu.js](https://github.com/ruilisi/pangu.js)实现，后端使用[rails-pangu](https://github.com/ruilisi/rails-pangu/)实现。本示例实现了如下功能：

> - 注册，登录，注销您的自定义帐户。
> - 创建或删除您的聊天室，加入或退出某人的聊天室。
> - 该聊天室中的所有用户可见。
> - 上传你的用户头像。
> - 在聊天室与您的朋友实时聊天。
