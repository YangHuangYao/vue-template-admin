const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'test', 'beta'].includes(process.env.NODE_ENV)

// 开启gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 打包分析
module.exports = {
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  devServer: {
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    open: true, // 是否打开浏览器
    host: 'localhost',
    port: '8080', // 代理断就
    // https: false,
    hotOnly: true, // 热更新
    proxy: {
      '/api': {
        target: process.env.APP_API_URL, // 目标代理接口地址
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        // ws: true, // 是否启用websockets
        pathRewrite: {
          '^/api': ''
        }
      },
      '/temp': {
        target: process.env.APP_TEMPLATE_URL, // 目标代理接口地址
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        // ws: true, // 是否启用websockets
        pathRewrite: {
          '^/temp': ''
        }
      }
    }
  },
  chainWebpack: config => {
    // 修复HMR热更新
    config.resolve.symlinks(true)
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@api', resolve('src/api'))
      .set('@icons', resolve('src/assets/icons'))
      .set('@styles', resolve('src/assets/styles'))
      .set('@images', resolve('src/assets/images'))
      .set('@components', resolve('src/components'))
      .set('@config', resolve('src/config'))
      .set('@constants', resolve('src/constants'))
      .set('@datas', resolve('src/datas'))
      .set('@directives', resolve('src/directives'))
      .set('@filters', resolve('src/filters'))
      .set('@lib', resolve('src/lib'))
      .set('@mock', resolve('src/mock'))
      .set('@plugins', resolve('src/plugins'))
      .set('@router', resolve('src/router'))
      .set('@store', resolve('src/store'))
      .set('@views', resolve('src/views'))
      .set('@themes', resolve('src/themes'))
      .set('@utils', resolve('src/utils'))
    if (IS_PROD) {
      // 图片压缩
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false }
          // webp: { quality: 75 }
        })
      // 打包分析
        // 打包之后自动生成一个名叫report.html文件(可忽视)
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
  },
  configureWebpack: config => {
    const plugins = []
    if (IS_PROD) {
      config.optimization = {
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
            // echarts: {
            //   name: 'chunk-echarts',
            //   test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
            //   chunks: 'all',
            //   priority: 4,
            //   reuseExistingChunk: true,
            //   enforce: true
            // }
          }
        }
      }
      // 开启 gzip 压缩
      return {
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: productionGzipExtensions,
            threshold: 10240,
            minRatio: 0.8
          })
        ]
      }
    }
    config.plugins = [...config.plugins, ...plugins]
  }
}
