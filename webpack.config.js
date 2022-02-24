const path = require('path')

module.exports = {
  mode: 'development',
  entry: './script/AuthSystem.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  watch: true,
}
