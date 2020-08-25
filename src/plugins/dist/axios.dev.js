"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _qs = _interopRequireDefault(require("qs"));

var _vue = _interopRequireDefault(require("vue"));

var _elementUi = require("element-ui");

var _index = _interopRequireDefault(require("@utils/index"));

var _httpStatusType = _interopRequireDefault(require("@config/http-status-type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NewAxios =
/*#__PURE__*/
function () {
  function NewAxios() {
    _classCallCheck(this, NewAxios);

    this.Loading = null;
    this.sources = {};
    this.requestList = []; // 一个数组用于存储每个ajax请求的取消函数和ajax标识

    this._config = {
      baseURL: process.env.APP_BASE_URL,
      timeout: 30 * 1000,
      crossDomain: true,
      withCredentials: true
    };
  }

  _createClass(NewAxios, [{
    key: "removePending",
    value: function removePending(request) {
      // 取消操作请求和移除请求记录
      for (var i = 0; i < this.requestList.length; i++) {
        if (request === this.requestList[i]) {
          this.requestList.splice(i, 1); // 把这条记录从数组中移除
        }
      }
    }
  }, {
    key: "setInterceptors",
    value: function setInterceptors(instance, CancelToken) {
      var self = this;
      var requestContinuousTime = _httpStatusType["default"].requestContinuousTime,
          requestContinuousTimeState = _httpStatusType["default"].requestContinuousTimeState; // http request 拦截器

      instance.interceptors.request.use(function (config) {
        self.Loading = _elementUi.Loading.service();
        config.headers.token = _index["default"].storageGet('location', 'token') ? _index["default"].storageGet('location', 'token') : '';
        config.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
        config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        var request = JSON.stringify(config.url) + JSON.stringify(config.method) + JSON.stringify(config.data || '');

        if (requestContinuousTimeState) {
          // 处理取消请求satrt
          config.cancelToken = new CancelToken(function (c) {
            // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
            self.sources[request] = c;
          });

          if (self.requestList.includes(request)) {
            self.sources[request]({
              requestType: 'warning',
              message: '请不要频繁操作！'
            });
            setTimeout(function () {
              self.removePending(request);
            }, requestContinuousTime);
          } else {
            if (!self.requestList.includes(request)) {
              self.requestList.push(request);
            }
          } // 处理取消请求end

        }

        return Promise.resolve(config);
      }, function (error) {
        // 对请求错误做处理...
        self.Loading.close();
        return Promise.reject(error);
      }); // http request 拦截器end
      // http response 拦截器start

      instance.interceptors.response.use(function (response) {
        self.Loading.close();
        self.checkStatus(response);
        return Promise.resolve(response.data);
      }, function (error) {
        // 对响应错误做处理...
        self.Loading.close();

        if (error.response) {
          return Promise.reject(self.checkStatus(error.response));
        } else if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          error.msg = '请求超时';
          return Promise.reject(error);
        } else {
          if (typeof error.message.message !== 'undefined') {
            (0, _elementUi.Message)({
              message: error.message.message,
              type: 'warning'
            });
          } else {
            _elementUi.Message.error(error.message);
          }

          return Promise.reject(error);
        }
      }); // http response 拦截器end
    }
  }, {
    key: "checkStatus",
    value: function checkStatus(response) {
      var status = response.status || -1000; // -1000 自己定义，连接错误的status

      if (status >= 200 && status < 300 || status === 304) {
        var data = response.data;
        var stateName = _httpStatusType["default"].stateName,
            successCode = _httpStatusType["default"].successCode;

        if (data[stateName] !== successCode) {
          _elementUi.Message.error(data.message);
        } // 如果http状态码正常，则直接返回数据


        return response.data;
      } else {
        return {
          status: status,
          msg: this.messageText(status)
        };
      }
    }
  }, {
    key: "messageText",
    value: function messageText(status) {
      var errorInfo = '';

      switch (status) {
        case -1:
          errorInfo = '远程服务响应失败,请稍后重试';
          break;

        case 400:
          errorInfo = '400：错误请求';
          break;

        case 401:
          errorInfo = '401：访问令牌无效或已过期';
          break;

        case 403:
          errorInfo = '403：拒绝访问';
          break;

        case 404:
          errorInfo = '404：资源不存在';
          break;

        case 405:
          errorInfo = '405：请求方法未允许';
          break;

        case 408:
          errorInfo = '408：请求超时';
          break;

        case 500:
          errorInfo = '500：访问服务失败';
          break;

        case 501:
          errorInfo = '501：未实现';
          break;

        case 502:
          errorInfo = '502：无效网关';
          break;

        case 503:
          errorInfo = '503：服务不可用';
          break;

        default:
          errorInfo = '连接错误';
      }

      _elementUi.Message.error(errorInfo);

      return errorInfo;
    }
  }, {
    key: "request",
    value: function request(options) {
      // 每次请求都会创建新的axios实例。
      var instance = _axios["default"].create();

      var CancelToken = _axios["default"].CancelToken;

      var config = _objectSpread({}, options, {
        baseURL: this._config.baseURL,
        timeout: this._config.timeout,
        crossDomain: this._config.crossDomain,
        // 设置cross跨域
        withCredentials: this._config.withCredentials,
        // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
        transformRequest: [function (data) {
          data = _qs["default"].stringify(data);
          return data;
        }]
      }); // 配置拦截器，支持根据不同url配置不同的拦截器。


      this.setInterceptors(instance, CancelToken);
      return instance(config); // 返回axios实例的执行结果
    }
  }, {
    key: "get",
    value: function get(url, data) {
      return this.request({
        method: 'get',
        url: url,
        params: data
      });
    }
  }, {
    key: "post",
    value: function post(url, data) {
      return this.request({
        method: 'post',
        url: url,
        params: data
      });
    }
  }, {
    key: "delete",
    value: function _delete(url, data) {
      return this.request({
        method: 'delete',
        url: url,
        params: data
      });
    }
  }, {
    key: "put",
    value: function put(url, data) {
      return this.request({
        method: 'put',
        url: url,
        params: data
      });
    }
  }]);

  return NewAxios;
}();

_vue["default"].prototype.$http = new NewAxios();

var _default = new NewAxios();

exports["default"] = _default;