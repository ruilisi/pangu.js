const path = require('path')
const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withLess = require('@zeit/next-less')
const lessToJs = require('less-vars-to-js')
const fs = require('fs')

const reScript = /\.(js|jsx|mjs)$/

const themeVariables = lessToJs(fs.readFileSync(path.resolve(__dirname, './antd-theme.less'), 'utf8'))

const nextConfig = {
  webpack: config => {
    const isDev = config.mode === 'development'
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    // https://github.com/zeit/next.js/blob/master/packages/next/build/webpack-config.ts
    config.module.rules[0].include = '/'
    config.module.rules[0].exclude = []

    const originalEntry = config.entry

    config.entry = async () => {
      const entries = await originalEntry()

      if (entries['main.js'] && !entries['main.js'].includes('./lib/polyfills.js')) {
        entries['main.js'].unshift('./lib/polyfills.js')
      }

      return entries
    }

    config.module.rules.push(
      {
        test: /\.md$/,
        loader: path.resolve(__dirname, './lib/markdown-loader.js')
      },
      {
        test: /\.(yaml|yml)$/,
        use: ['json-loader', 'yaml-loader']
      }
    )

    if (isDev) {
      config.module.rules.push({
        test: reScript,
        loader: 'eslint-loader',
        exclude: ['/node_modules/', '/.next/', '/out/'],
        enforce: 'pre',
        options: {
          emitWarning: true
        }
      })
    }

    return config
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret'
  }
}

module.exports = withSass(withCSS(withLess(nextConfig)))
