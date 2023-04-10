/*
 * @Author: mulingyuer
 * @Date: 2021-07-09 16:18:51
 * @LastEditTime: 2021-07-09 16:19:19
 * @LastEditors: mulingyuer
 * @Description: polyfill
 * @FilePath: \saas-admin-vue\src\base\utils\polyfill.js
 * 怎么可能会有bug！！！
 */

//去除谷歌的touch事件警告
(function () {
  if (typeof EventTarget !== "undefined") {
    let func = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function (type, fn, capture) {
      this.func = func
      if (typeof capture !== "boolean") {
        capture = capture || {}
        capture.passive = false
      }
      this.func(type, fn, capture)
    }
  }
}())