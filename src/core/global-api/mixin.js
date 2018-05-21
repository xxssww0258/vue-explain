/* @flow */

import { mergeOptions } from '../util/index'
// 赋予传进来的对象有一个mixin的函数
  // mixin 函数会把this.option 和 传进来的options合并

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
