"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// 后台接口返回的状态码字段名称 stateName,成功的状态码successCode,连续请求间隔时间requestContinuousTime（requestContinuousTime内只能请求一次）
var _default = {
  stateName: 'stateCode',
  successCode: 200,
  requestContinuousTime: 2 * 1000,
  // 连续请求时间间隔
  requestContinuousTimeState: true // 是否设置频繁请求的请求拦截

};
exports["default"] = _default;