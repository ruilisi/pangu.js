# Next.js-pangu
[中文文档 Chinese document](/README.CN.md)

`Next.js-Pangu` is a frontend javascript starter kit which inherits from [Next.js](https://github.com/zeit/next.js/) and is heavily depended on [Rails-pangu](https://github.com/paiyou-network/rails-pangu). It focus on being an lean example of using `Next.js` while solving left issues which `Next.js` haven't solved  or `Next.js` does not intend to solve(for example, support `IE9`). Since it is heavily connected with `rails` backend, this project also offers examples or solutions for doing backend work, ex., connecting [action cable](https://github.com/rails/rails/tree/master/actioncable) and authenticating that connection through `jwt`.

## Features

#### Server Rendering
With `Next.js`, server rendering React applications has never been easier, no matter where your data is coming from.

#### Static Exporting
No need to learn a new framework. Exporting a static site with Next.js is as easy as a single command.

#### CSS-in-JS
Next.js comes with styled-jsx included, but it also works with every CSS-in-JS solution you know and love.

#### Zero Setup
Automatic code splitting, filesystem based routing, hot code reloading and universal rendering.

#### Fully Extensible
Complete control over Babel and Webpack. Customizable server, routing and next-plugins.
#### Ready for Production
Optimized for a smaller build size, faster dev compilation and dozens of other improvements.

#### Supports IE11, IE10, IE9
While `IE` stuff is fading out of browser world cause its weird implementation which results in poor support for new js/css syntax, `IE` family still shares a tremendous market of browsers. Statistics from [netmarketshare](https://gs.statcounter.com/browser-market-share/desktop/worldwide) shows that `IE`  family still accounts for `3.67%` of the whole desktop market at the moment of writing this README (Dec 07, 2019).
<img src="./doc/desktop-browser-market-share.png" width="60%" align="middle" />
 
That's to say more than 3 out of 100 people will not be able to visit websites built by `Next.js`, which is intolerable for most web projects with out doubt. 
The reasons why projects built with `Next.js` does not support `IE 9-11` are mainly: 
* `Objects`(`Map`, `String`, `Array`) in `IE 9-11` do not contain functions but libraries or code contain usages of them. We offer file `lib/polyfill.js` to resolve this issue.
* Node modules contain syntax that IE can't recognize and polyfills can't fix, for example, arrow function `=>`. Our solution to solve this problem is actually hacky (any better solution is welcome as a `PR`) by adding files need to be transcompiled into [webpack config](https://github.com/zeit/next.js/blob/master/packages/next/build/webpack-config.ts) of `Next.js` through monkey patching in `next.config.js`. If any node module you added later offenses `IE 9-11`, you can do the same trick by adding paths with the code below.

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

## Javascript libraries included
#### `readt-intl`
This library provides React components and an API to format dates, numbers, and strings, including pluralization and handling translations.
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

```
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from './state'

export default (initialState = {}) => {
  return createStore(makeRootReducer(), initialState, applyMiddleware(thunk))
}

```

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