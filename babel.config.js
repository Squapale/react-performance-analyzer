module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
        browsers: ['> 1%', 'last 2 versions']
      }
    }],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-object-rest-spread'
  ]
};
