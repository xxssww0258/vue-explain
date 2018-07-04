// 获取VUE 构造函数 然后挂摘API上去之后返回

import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'


// 函数也是对象,是个构造函数的同时,挂载方法在构造函数对象中
// new Vue() 得到的是 vue实例
// Vue.use() 就是挂在类似这些API
initGlobalAPI(Vue)//给Vue 构造函数挂在一堆api

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// 服务器渲染相关
// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

// 挂载一个版本号上去  估计是不知道在哪里拼接package.json上面的版本号
Vue.version = '__VERSION__'

export default Vue //输出vue构造函数
