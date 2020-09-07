const proxy = require('./src/config/proxy.js')
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'test', 'beta'].includes(process.env.NODE_ENV)

const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启gzip压缩
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin// 打包分析
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

module.exports = {
  productionSourceMap: false,
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        prependData: `
        @import "@styles/variables.scss";
        @import "@styles/mixin.scss";
        @import "@styles/function.scss";
        $src: "${process.env.VUE_APP_OSS_SRC}";
        `
      }
    }
  },
  devServer: {
    // 在本地服务器开启gzip，线上服务器都支持gzip不需要设置
    before(app) {
      // app.get(/.*.(js)$/, (req, res, next) => {
      //   req.url = req.url + '.gz'
      //   res.set('Content-Encoding', 'gzip')
      //   next()
      // })
    },
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    open: false, // 是否打开浏览器
    host: 'localhost',
    port: '8083', // 代理断就
    // https: false,
    hotOnly: true, // 热更新
    proxy: proxy.proxy
  },
  chainWebpack: config => {
    // 修复HMR热更新
    config.resolve.symlinks(true)
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@icons', resolve('src/assets/icons'))
      .set('@images', resolve('src/assets/images'))
      .set('@styles', resolve('src/assets/styles'))
      .set('@components', resolve('src/components'))
      .set('@config', resolve('src/config'))
      .set('@constants', resolve('src/constants'))
      .set('@directives', resolve('src/directives'))
      .set('@filters', resolve('src/filters'))
      .set('@lib', resolve('src/lib'))
      .set('@mixin', resolve('src/mixin'))
      .set('@plugins', resolve('src/plugins'))
      .set('@request', resolve('src/request'))
      .set('@router', resolve('src/router'))
      .set('@store', resolve('src/store'))
      .set('@utils', resolve('src/utils'))
      .set('@views', resolve('src/views'))
    if (IS_PROD) {
      // lodash按需打包
      config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin())
      // 添加hash文件名解决服务器部署缓存start
      config
        .output
        .filename('[name][chunkhash].js')
        .end()
      config
        .output
        .chunkFilename('[name][chunkhash].js')
        .end()
      // 添加hash文件名解决服务器部署缓存end
      // 打包分析 打包之后自动生成一个名叫report.html文件(可忽视)
      // config.plugin('webpack-report').use(BundleAnalyzerPlugin, [{
      //   analyzerMode: 'static'
      // }])
    }
  },
  configureWebpack: config => {
    const plugins = []
    if (IS_PROD) {
      config.externals = {
        'element-ui': 'element'
      }
      config.optimization = {
        // runtimeChunk: true,
        minimize: true,
        splitChunks: {
          cacheGroups: {
            common: {
              name: 'chunk-common',
              chunks: 'initial',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: true,
              enforce: true
            },
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'initial',
              priority: 2,
              reuseExistingChunk: true,
              enforce: true
            },
            elementUI: {
              name: 'chunk-elementui',
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              chunks: 'all',
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            }
            //       // echarts: {
            //       //   name: 'chunk-echarts',
            //       //   test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
            //       //   chunks: 'all',
            //       //   priority: 4,
            //       //   reuseExistingChunk: true,
            //       //   enforce: true
            //       // }
          }
        }
      }
      // 文件压缩
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
    config.plugins = [...config.plugins, ...plugins]
  }
}
