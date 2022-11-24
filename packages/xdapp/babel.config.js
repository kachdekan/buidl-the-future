module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo', ['@babel/preset-env', { targets: { node: 'current' } }]],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'xdapp/app': './app',
            'xdapp/blockchain': './blockchain',
            'xdapp/components': './components',
            'xdapp/features': './features',
            'xdapp/utils': './utils',
          },
        },
      ],
    ],
  }
}
