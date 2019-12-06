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
