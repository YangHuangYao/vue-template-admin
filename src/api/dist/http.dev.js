"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("@/plugins/axios"));

var _path = _interopRequireDefault(require("./path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('@config/proxy.js'),
    typeList = _require.typeList;

var Http =
/*#__PURE__*/
function () {
  function Http() {
    _classCallCheck(this, Http);

    this.type = typeList[0];
    this.path = _path["default"];
  }

  _createClass(Http, [{
    key: "setProxyType",
    value: function setProxyType(data) {
      // 设置代理接口类型 按照typeList记录是值来设置
      this.type = data;
    }
  }, {
    key: "getProxyPath",
    value: function getProxyPath() {
      var path = process.env.NODE_ENV === 'development' ? this.type : '';
      return path;
    }
  }, {
    key: "get",
    value: function get(url, data) {
      return _axios["default"].get(this.getProxyPath() + url, data);
    }
  }, {
    key: "post",
    value: function post(url, data) {
      return _axios["default"].post(this.getProxyPath() + url, data);
    }
  }, {
    key: "delete",
    value: function _delete(url, data) {
      return _axios["default"]["delete"](this.getProxyPath() + url, data);
    }
  }, {
    key: "put",
    value: function put(url, data) {
      return _axios["default"].put(this.getProxyPath() + url, data);
    }
  }]);

  return Http;
}();

var _default = Http;
exports["default"] = _default;