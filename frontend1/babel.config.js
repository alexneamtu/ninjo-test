module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    'module:@react-native/babel-preset',
  ],
  plugins: [],
};