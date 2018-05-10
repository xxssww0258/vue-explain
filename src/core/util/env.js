/* @flow */
// 这是一个环境判断文件 输出一堆环境
// can we use __proto__?
export const hasProto = '__proto__' in {}//是否拥有隐式原型

// Browser environment sniffing
export const inBrowser = typeof window !== 'undefined' //判断是否在浏览器
export const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform//判断是否在weex
export const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()//判断weex平台
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()//获取ua
export const isIE = UA && /msie|trident/.test(UA)// 是否ie
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0//是否ie9
export const isEdge = UA && UA.indexOf('edge/') > 0//是否edge
export const isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android')//是否安卓
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios')//是否IOS
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge//是否谷歌

// Firefox has a "watch" function on Object.prototype...
export const nativeWatch = ({}).watch// 获取火狐上面的watch

export let supportsPassive = false//是否支持被动事件
if (inBrowser) {
  try {
    const opts = {}
    Object.defineProperty(opts, 'passive', ({
      get () {
        /* istanbul ignore next */
        supportsPassive = true
      }//这是一个flow 的 bug所以用try抱住
    }: Object)) // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts)
    //触发get访问器事件,修改supportsPassive为true
    // 如果不兼容被动属性的话 第三个对象不回被触发
  } catch (e) {}
}

// 是否武器渲染
// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
let _isServer
export const isServerRendering = () => {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }
  return _isServer
}

// detect devtools
// 检测调试工具  在浏览器且 下载Vue devtool工具
export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

/* istanbul ignore next */
// 是否原生
export function isNative (Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)

let _Set //判断有没有Set数组 否则就写一个 Set数组
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = class Set implements SimpleSet {
    set: Object;
    constructor () {
      this.set = Object.create(null)
    }
    has (key: string | number) {
      return this.set[key] === true
    }
    add (key: string | number) {
      this.set[key] = true
    }
    clear () {
      this.set = Object.create(null)
    }
  }
}

interface SimpleSet {
  has(key: string | number): boolean;
  add(key: string | number): mixed;
  clear(): void;
}

export { _Set }
export type { SimpleSet }
