function presets(modules = false, loose = true) {
  return [['@babel/preset-env', { loose, modules }], '@babel/preset-react']
}

module.exports = {
  presets: presets(),
  plugins: [
    // Stage 3
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['transform-react-remove-prop-types', { mode: 'unsafe-wrap' }],
    'annotate-pure-calls',
  ],
  env: { test: { presets: presets('commonjs') } },
}
