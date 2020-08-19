const path = require('path'),
  resolve = dir => path.join(__dirname, dir),
  IS_PROD = ['production', 'test', 'beta'].includes(process.env.NODE_ENV)

// 开启gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin'),
  productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
module.exports = {
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
        target: 'https://wwwxxxx', // 目标代理接口地址
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        // ws: true, // 是否启用websockets
        pathRewrite: {
          '^/api': ''
        }
      },
      '/temp': {
        target: 'https://wwwxxxx', // 目标代理接口地址
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
    }
  },
  configureWebpack: config => {
    if (IS_PROD) {
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
  }
}
