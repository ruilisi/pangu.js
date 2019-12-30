# Pang.js

[中文文档 Chinese document](/README.CN.md)

`Pang.js` is a frontend starter kit inherited from [Pang.js](https://github.com/zeit/Pang.js/) and is heavily depended on [Rails-pangu](https://github.com/ruilisi/rails-pangu) for backend. It focus on being an lean example of using `Pang.js` while solving left issues which `Pang.js` haven't solved or `Pang.js` does not intend to solve(for example, support `IE9`). 


## Features offered by `Pang.js`

* Server Rendering
* Static Exporting: Exporting a static site with Pang.js is as easy as a single command.
* CSS-in-JS: Pang.js comes with styled-jsx included, but it also works with every CSS-in-JS solution you know and love.
* Zero Setup: Automatic code splitting, filesystem based routing, hot code reloading and universal rendering.
* Fully Extensible: Complete control over Babel and Webpack. Customizable server, routing and next-plugins.
* Ready for Production: Optimized for a smaller build size, faster dev compilation and dozens of other improvements.


## Features
#### Websocket by [ActionCable](https://edgeguides.rubyonrails.org/action_cable_overview.html)
This project heavily uses websocket for transmitting data.
For those of you who aren't very familiar with `websocket`, I recommend you to watch this vedio [here](https://www.youtube.com/watch?v=PjiXkJ6P9pQ).
As many of you would probably know, [meteorjs](https://www.meteor.com/) uses `websocket` universally for connections between frontend and backend. 
This project mimics what [meteorjs] did with a rails backend, and the reasons for doing that are below(largely quoted [here](https://blogs.windows.com/windowsdeveloper/2016/03/14/when-to-use-a-http-call-instead-of-a-websocket-or-http-2-0/)):
* Fast Reaction Time
  When a client needs to react quickly to a change (especially one it cannot predict), a WebSocket may be best. Consider a chat application that allows multiple users to chat in real-time. If WebSockets are used, each user can both send and receive messages in real-time. WebSockets allow for a higher amount of efficiency compared to REST because they do not require the HTTP request/response overhead for each message sent and received.
* Ongoing Updates
  When a client wants ongoing updates about the state of the resource, WebSockets are generally a good fit. WebSockets are a particularly good fit when the client cannot anticipate when a change will occur and changes are likely to happen in the short term.HTTP, on the other hand, may be a better fit if the client can predict when changes occur or if they occur infrequently—for example, a resource that changes hourly or changes only after it knows that a related resource is modified. If the client doesn’t know that the related resource is modified (e.g. because some other client modified it, or the service modified it), then WebSockets are better.
* Ad-hoc Messaging
  The WebSocket protocol is not designed around request-response. Messages may be sent from either end of the connection at any time, and there is no native support for one message to indicate it is related to another. This makes the protocol well suited to “fire and forget” messaging scenarios and poorly suited for transactional requirements. The messaging layer must address your transactional needs if that’s needed in your application.
* High-Frequency Messaging with Small Payloads
  The WebSocket protocol offers a persistent connection to exchange messages. This means that individual messages don’t incur any additional tax to establish the transport. Taxes such as establishing SSL, content negotiation, and exchange of bulky headers are imposed only once when the connection is established. There is virtually no tax per message. On the other hand, while HTTP v1.1 may allow multiple requests to reuse a single connection, there will generally be small timeout periods intended to control resource consumption. Since WebSockets were designed specifically for long-lived connection scenarios, they avoid the overhead of establishing connections and sending HTTP request/response headers, resulting in a significant performance boost.However, this should not be taken to extremes. Avoid using WebSockets if only a small number of messages will be sent or if the messaging is very infrequent. Unless the client must quickly receive or act upon updates, maintaining the open connection may be an unnecessary waste of resources.
* Avoids painful implementing and testing of realtime functionality
  Software functionalities which require realtime interactions, ex., payments, are always hard to implement and test, mainly because:
    * Most developers do not have enough experience of implementing and tesing websocket.
    * Realtime functionalities are very rare for most of the projects.
  However, if websocket is used almost universally across the project, then it becomes an obvious thing, and you will handle it easily.

#### `Jwt` authentication for both http and websocket
We believe that http authentication trough `jwt` is the best choice for most of the projects. 
Jwt authentication for http is done at [request.js](utils/request.js).
Jwt authentication for websocket is done by the package [ActionCable-jwt](https://www.npmjs.com/package/actioncable-jwt) implemented by us.

#### CSS shortcuts

Since we adopted Pangu.js, it supports CSS / Sass / Less / Stylus files, which is convenient for us to add CSS styles freely.

```js
:global {
  .example {
    font-size: 20px;
  }
}

export default () => <div className="example">Example</div>
```

Besides, we also added support for variables, such as:

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

#### Supports IE11, IE10, IE9

While `IE` stuff is fading out of browser world cause its weird implementation which results in poor support for new js/css syntax, `IE` family still shares a tremendous market of browsers. Statistics from [netmarketshare](https://gs.statcounter.com/browser-market-share/desktop/worldwide) shows that `IE` family still accounts for `3.67%` of the whole desktop market at the moment of writing this README (Dec 07, 2019).
<img src="./doc/desktop-browser-market-share.png" width="60%" align="middle" />

That's to say more than 3 out of 100 people will not be able to visit websites built by `Pang.js`, which is intolerable for most web projects with out doubt.
The reasons why projects built with `Pang.js` does not support `IE 9-11` are mainly:

- `Objects`(`Map`, `String`, `Array`) in `IE 9-11` do not contain functions but libraries or code contain usages of them. We offer file `lib/polyfill.js` to resolve this issue.
- Node modules contain syntax that IE can't recognize and polyfills can't fix, for example, arrow function `=>`. Our solution to solve this problem is actually hacky (any better solution is welcome as a `PR`) by adding files need to be transcompiled into [webpack config](https://github.com/zeit/Pang.js/blob/master/packages/next/build/webpack-config.ts) of `Pang.js` through monkey patching in `next.config.js`. If any node module you added later offenses `IE 9-11`, you can do the same trick by adding paths with the code below.

```js
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

#### Convenient shortcut keys in [shortcuts.js](./utils/shortcuts.js)

- Switch between local/remote API server
  - By pressing `esc l`, page gets reloaded and the frontend will use `API_ROOT_LOCAL` of as local api host.
  - By pressing `esc r`, page gets reloaded and the frontend will figure out and use the best remote api host in `REMOTE_HOSTS` by `ping` each remote hosts.

## Quick start

- While this project is developed with Nodejs `v12.1.0`, you can try any version of Nodejs that works.
- Run `yarn` => `yarn dev`.

## Deployment

[Dockerfile](./Dockerfile) is attached for building this project, and run `bin/build.sh` to build it.

## Javascript libraries included

#### `readt-intl`

This library provides React components and an API to format dates, numbers, and strings, including pluralization and handling translations.

Note: some new API were called by new version of formatjs source code, but X5 core broswer crash when everytime these two method executed. If you want to use X5 core browser, please downgrade react-intl to below 3.0.

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

#### `Redux`

React is great, and it’s entirely possible to write a complete application using nothing but React. However, as an application gets more complex, sometimes it’s not as straightforward to use plain old React. Using a state management library like `Redux` can alleviate some of the issues that crop up in more complex applications.

#### Http connection (jwt authentication) with rails-pangu

#### Action Cable(rails way of websocket) connection (jwt authentication) with rails-pangu

#### babel-plugin-root-import

This module together with `eslint-import-resolver-babel-plugin-root-import` make importing long but often used paths easy by replacing paths with special characters, such as `~`, `%`. Below is related config code:

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

## A deployment method

**[ZEIT Now](https://zeit.co/docs)** (https://zeit.co/docs) is a cloud platform for static sites and Serverless Functions. It enables developers to host websites and web services that deploy instantly, scale automatically, and requires no supervision, all with no configuration.

Getting started with `ZEIT Now` takes just a few steps and lets you get up and running with your new project in less than a minute.

## Example using pangu.js

**[Example](https://pangu.js.now.sh)** (https://pangu.js.now.sh)

In this example, the front-end is implemented using [pangu.js](https://github.com/ruilisi/pangu.js), and the back-end is implemented using [rails-pangu](https://github.com/ruilisi/rails-pangu/). This example implements the following functions:

> - register, login, sign out your custom account;
> - create or delete your chat room, join or quit someone's chat room;
> - visible to all users in this chat room；
> - upload your custom avatar;
> - chat live with your friends in the chat room;

## ISSUES
####  How to pass styles generated by styled-jsx down to nested components

```javascript
import css from 'styled-jsx/css'
import { Button } from 'antd'
const { className, styles } = css.resolve`
  .ant-btn {
    width: 100px;
  }
`
<div>
    <Button type="primary" className={className}>
      Get Started
    </Button>
    {styles}
</div>

```

#### Property left of AssignmentExpression expected node to be of a type ["LVal"] but instead got "BooleanLiteral"
* `cd node_modules/process`
* delete `process.browser = true` from `package.json`
