/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods. 
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = { // 暴露工具方法
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set //observer
  Vue.delete = del //observer
  Vue.nextTick = nextTick // util

  Vue.options = Object.create(null) // map
    // // 组件 指令  过滤
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  // 这用于标识“基本”构造函数，以便在Weex的多实例场景中扩展所有纯对象组件。
  Vue.options._base = Vue //

  // 组件 和  keep-alive
  extend(Vue.options.components, builtInComponents)

  initUse(Vue) // 挂载 .use
  initMixin(Vue) //  挂载 .mixin
  initExtend(Vue)// 挂载 extend
  initAssetRegisters(Vue)// 挂载 组件 指令 过滤
}
