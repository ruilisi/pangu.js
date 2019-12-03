const pkg = require('./package.json')

module.exports = {
  presets: [
    [
      'next/babel',
      {
        targets: {
          browsers: pkg.browserslist
        },
        forceAllTransforms: true,
        modules: false,
        useBuiltIns: 'usage',
        debug: false
      }
    ]
  ],
  test: path => {
    if (path.match(/(browser|common)\.js/)) {
      return true
    }
    if (path.match(/[\\/](strip-ansi|ansi-regex)[\\/]/)) {
      return true
    }
    const match = path.match(/node_modules\/(.*?)\//)
    if (match) {
      const moduleName = match[1]
      if (moduleName === 'next') {
        return [/next[\\/]dist[\\/]next-server[\\/]lib/, /next[\\/]dist[\\/]client/, /next[\\/]dist[\\/]pages/].some(regex => regex.test(path))
      }
      const moduleToBeResolved = [
        'react-intl',
        'intl-messageformat',
        'intl-messageformat-parser',
        'query-string',
        'split-on-first',
        'engine.io-client',
        'strict-uri-encode'
      ]
      return moduleToBeResolved.includes(moduleName)
    }
    return true
  },
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
}
