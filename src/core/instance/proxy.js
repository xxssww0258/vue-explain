/* not type checking this file because flow doesn't play well with Proxy */
// 这里Vue的代码主要将代理运用于拦截。并且由于规范依然在发展，所以大家慎用。。。
import config from 'core/config' // 获取配置文件
import { warn, makeMap, isNative } from '../util/index' //获取工具函数

let initProxy

if (process.env.NODE_ENV !== 'production') {
  // 生成一个map 该处定义了所允许的全局对象类型
  const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  )
  // 警告不存在
  const warnNonPresent = (target, key) => {
    warn(
      `Property or method "${key}" is not defined on the instance but ` +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }
  // 是否拥有proxy 函数
  const hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy)
// 避免覆盖config.keyCodes中的内置修饰符： 其意义在于禁止用户修改Vue内建的一些按键值，这些按键值和按键名是对应的
  if (hasProxy) { 
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    config.keyCodes = new Proxy(config.keyCodes, {
      set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
  }
  // 在 for in 的时候检查报错
  const hasHandler = {
    has (target, key) {
      const has = key in target
      const isAllowed = allowedGlobals(key) || (typeof key === 'string' && key.charAt(0) === '_')
      if (!has && !isAllowed) {
        warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
  }
  // 在获取值的时候检查报错
  const getHandler = {
    get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key)
      }
      return target[key]
    }
  }

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      const options = vm.$options
      const handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler
      vm._renderProxy = new Proxy(vm, handlers)
    } else { //否则就不拦截
      vm._renderProxy = vm
    }
  }
}

export { initProxy }
