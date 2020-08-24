'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor
}

var Utils =
/* #__PURE__ */
(function () {
  function Utils() {
    _classCallCheck(this, Utils)

    this._utils = {
      storageType: 'session'
    }
  }

  _createClass(Utils, [{
    key: 'storageSet',
    value: function storageSet() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._utils.storageType
      var name = arguments.length > 1 ? arguments[1] : undefined
      var data = arguments.length > 2 ? arguments[2] : undefined

      if (type === 'session') {
        sessionStorage.setItem(name, JSON.stringify(data))
      } else {
        localStorage.setItem(name, JSON.stringify(data))
      }
    }
  }, {
    key: 'storageRemove',
    value: function storageRemove() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._utils.storageType
      var name = arguments.length > 1 ? arguments[1] : undefined

      if (type === 'session') {
        sessionStorage.removeItem(name)
      } else {
        localStorage.removeItem(name)
      }
    }
  }, {
    key: 'storageClear',
    value: function storageClear() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._utils.storageType

      if (type === 'session') {
        sessionStorage.clear()
      } else {
        localStorage.clear()
      }
    }
  }, {
    key: 'storageGet',
    value: function storageGet() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._utils.storageType
      var name = arguments.length > 1 ? arguments[1] : undefined
      var storg = type === 'session' ? sessionStorage.getItem(name) : localStorage.getItem(name)

      try {
        return storg ? type === 'session' ? JSON.parse(sessionStorage.getItem(name)) : JSON.parse(localStorage.getItem(name)) : ''
      } catch (err) {
        console.log('err: ', err)
      }
    }
  }])

  return Utils
}())

var _default = new Utils()

exports.default = _default
