class Config {
  constructor(options) {
    this._config = {}
  }

  regist(type, value) {
    this._config[type] = value
  }

  get(type) {
    return this._config[type]
  }
}
export default new Config()
