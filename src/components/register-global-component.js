// 全局注册组件
import Vue from 'vue'
import Utils from '@utils/index'
// true遍历子目录
const requireComponet = require.context('./', true, /\.vue$/)
requireComponet.keys().forEach(fileName => {
  const _keyArr = fileName.split('.')
  let componentName
  const config = requireComponet(fileName)
  if (Utils.getStrBefore(_keyArr[1], '/')) { // 前面有内容说明有文件目录
    const pathName = JSON.parse(JSON.stringify(_keyArr[1]))
    const _keyNameArr = pathName.split('/')

    if (_keyNameArr[_keyNameArr.length - 1] === 'index') {
      componentName = Utils.firstUpperCase(_keyNameArr[_keyNameArr.length - 2])
    } else {
      componentName = Utils.changeStr(
        fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
      )
    }
  } else {
    componentName = Utils.changeStr(
      fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
    )
  }
  Vue.component(componentName, config.default || config)
})
