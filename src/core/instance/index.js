import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  //执行init  init.js 里面 
  this._init(options) 
}

//添加到构造函数的原型里面
// 只能加载原型里面 没办法加载在构造函数里
initMixin(Vue) //init
stateMixin(Vue) //state
eventsMixin(Vue) //event
lifecycleMixin(Vue) // 生命周期
renderMixin(Vue) //渲染

export default Vue
