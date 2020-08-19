const IS_PROD = ['production', 'test', 'beta'].includes(process.env.NODE_ENV)
const plugins = []
if (IS_PROD) {
  // 去除console.log
  plugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins
}
