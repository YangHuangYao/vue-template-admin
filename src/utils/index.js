import Storage from './storage'
class Utils {
  constructor() {
    this.storage = Storage
  }

  changeStr (str) {
    if (str.includes('/')) {
      const index = str.lastIndexOf('/')
      str = str.substring(index + 1, str.length)
      return str.charAt(0).toUpperCase() + str.slice(1)
    } else {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  }

  getStrAfter (sourceSrt, target) { // 获取指定字符之后的内容
    const index = sourceSrt.lastIndexOf(target)

    return sourceSrt.substring(index + 1, sourceSrt.length)
  }


  getStrBefore (sourceSrt, target) { // 获取指定字符之前的内容
    const index = sourceSrt.lastIndexOf(target)
    return sourceSrt.substring(0, index)
  }

  firstUpperCase (str) { // 首字母大写
    const firstPathName = str[0].toUpperCase()
    const lastPathName = str.substring(1, str.length)
    return firstPathName + lastPathName
  }

  firstToLowerCase (str) { // 首字母小写
    const firstPathName = str[0].toLowerCase()
    const lastPathName = str.substring(1, str.length)
    return firstPathName + lastPathName
  }
}
export default new Utils()
