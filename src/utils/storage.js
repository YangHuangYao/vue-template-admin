
class Storage {
  constructor() {
    this.type = 'session'
  }

  get ({ type, key }) {
    const _type = type || this.type
    const storg = _type === 'session' ? sessionStorage.getItem(key) : localStorage.getItem(key)
    return storg ? JSON.parse(storg) : ''
  }

  set ({ type, key, data }) {
    const _type = type || this.type
    if (_type === 'session') {
      sessionStorage.setItem(key, JSON.stringify(data))
    } else if (_type === 'local') {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }

  remove ({ type, key }) {
    const _type = type || this.type
    if (_type === 'session') {
      sessionStorage.removeItem(key)
    } else if (_type === 'local') {
      localStorage.removeItem(key)
    }
  }

  clear ({ type }) {
    const _type = type || this.type
    if (_type === 'session') {
      sessionStorage.clear()
    } else if (_type === 'local') {
      localStorage.clear()
    }
  }
}
export default new Storage()
