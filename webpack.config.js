// 多页面
// optimization: {
//     splitChunks: {
//         chunks: 'initial',
//         minSize:0,
//         cacheGroups: {
//            vendor:{
//                test:/([\\/]node_modules[\\/])/,
//                name:"vendor",
//                chunks:"all"
//            }
//         }
//     },
//     runtimeChunks:true
// }
// 单页面
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'initial',
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /([\\/]node_modules[\\/])/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    },
    runtimeChunks: true
  }
}
