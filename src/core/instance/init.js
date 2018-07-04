/* @flow */
// _init被执行后九绑定了一堆方法到vm上

import config from '../config' // 一堆配置参数
import { initProxy } from './proxy' 
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0 // uid 我猜是视口id
export function initMixin (Vue: Class<Component>) { // 出口一个混合状态的vue
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this // 因为这里是构造函数 所以这里的this 是实例对象 并不是Vue
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    // 渲染时间记录
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed/*一个防止vm实例自身被观察的标志位*/
    vm._isVue = true //执行过_init 就会有一个isVue的标记
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation 优化内部组件实例
      // since dynamic options merging is pretty slow, and none of the 因为动态选项合并很慢，而且没有
      // internal component options needs special treatment. 内部组件选项需要特殊处理。
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') { // 开发环境才 禁止占用关键字
      initProxy(vm)
    } else { // 实际生产环境不禁止
      vm._renderProxy = vm //这是什么鬼 我也不清楚
    }
    // expose real self 暴露自己
    vm._self = vm
    initLifecycle(vm) /*初始化生命周期*/
    initEvents(vm) /*初始化事件*/
    initRender(vm) /*初始化render*/
    callHook(vm, 'beforeCreate') /*调用beforeCreate钩子函数并且触发beforeCreate钩子事件*/
    initInjections(vm) // resolve injections before data/props
    initState(vm) 
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')/*调用created钩子函数并且触发created钩子事件*/

    /* istanbul ignore if */
    // 渲染速度标记
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)// <Anonymous> 得到
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)// 这个渲染是需要修改config.performance=true 才行的  还有一个vue performance devtool 的插件
    }
    // 如有.el这个属性就挂载 在指定对象上
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)// 挂在
    }
  }
}

export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor: Class<Component>) {//解析构造器选项
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed, 超级选项已更改，
      // need to resolve new options.需要解决新的选择。
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options 更新基本扩展选项
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const extended = Ctor.extendOptions
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed]
    extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i])
      }
    }
    return res
  } else {
    return latest
  }
}