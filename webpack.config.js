const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  watch: true,
  mode: 'development',
  devtool: 'eval-source-map',
  watchOptions: {
    ignored: /node_modules/
  },
  entry: {
    'pickled': './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, '../pickled/public'),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
          }
        ]
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader', 
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      }
    ]
  }, 
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.min.js'
    },
    extensions: [ '.tsx', '.ts', '.js', '.vue', '.json' ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
