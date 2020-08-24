class Utils {
  constructor() {
    this._utils = {
      storageType: 'session'
    }
  }

  storageSet(type = this._utils.storageType, name, data) {
    if (type === 'session') {
      sessionStorage.setItem(name, JSON.stringify(data))
    } else {
      localStorage.setItem(name, JSON.stringify(data))
    }
  }

  storageRemove(type = this._utils.storageType, name) {
    if (type === 'session') {
      sessionStorage.removeItem(name)
    } else {
      localStorage.removeItem(name)
    }
  }

  storageClear(type = this._utils.storageType) {
    if (type === 'session') {
      sessionStorage.clear()
    } else {
      localStorage.clear()
    }
  }

  storageGet(type = this._utils.storageType, name) {
    const storg = type === 'session' ? sessionStorage.getItem(name) : localStorage.getItem(name)
    try {
      return storg ? (type === 'session' ? JSON.parse(sessionStorage.getItem(name)) : JSON.parse(localStorage.getItem(name))) : ''
    } catch (err) {
      console.log('err: ', err)
    }
  }
}
export default new Utils()
