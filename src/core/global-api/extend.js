/* @flow */
// 这个global-api 是给Vue 构造函数上添加api
// Vue.extend
// Vue.cid  = 0

import { ASSET_TYPES } from 'shared/constants'
import { defineComputed, proxy } from '../instance/state'
import { extend, mergeOptions, validateComponentName } from '../util/index'

export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   * 包含Vue的每个实例构造函数都有一个uniquecid。 
   * 这使我们能够为原型继承创建包装的“子构造函数”并缓存它们。
   */
  // cid 组件id
  Vue.cid = 0
  let cid = 1 //闭包自增cid

  /**
   * Class inheritance 类继承
   * 创建组件
   */
  // extendOptions = {
	// 	template: '<p v-show="param">i am {{name}}{{myId}}</p>'||'#dd'||'<App 引入的自定义标签/>',
	// 	props:['my-id']
	// 	data:function(){
	// 		return {
	// 			name : 'zhangsan'
	// 			mid:this.myId
	// 		}
	// 	}
	// 	methods:{}
	// 	created:{}
	// }
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    // 检测
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }
    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {// 检核组件命名合法性
      validateComponentName(name)
    }
    // 创建一个VueComponent构造函数 把原型 指向vm的原型
    const Sub = function VueComponent (options) {
      this._init(options) // 执行初始化  这里在init.js 定义了
    }
    // 这样写主要是为了修改constructor为Sub 如果直接赋值Super.prototype就指向Vue去了 instanceof 就不能检测到 Vue.extend 是Sub的实例
    Sub.prototype = Object.create(Super.prototype)//生产一个对象 并修改原型指向
    Sub.prototype.constructor = Sub 
    Sub.cid = cid++
    Sub.options = mergeOptions(//合并根Vue的配置
      Super.options,// Super.options 是根Vue的配置对象
      extendOptions
    )
    Sub['super'] = Super//超级选项 配合下面的superOptions 但是不知道有什么用

    // For props and computed properties, we define the proxy getters on 对于道具和计算属性，我们定义了代理getters
    // the Vue instances at extension time, on the extended prototype. This 扩展时的Vue实例，扩展原型。 这个
    // avoids Object.defineProperty calls for each instance created. 避免为创建的每个实例调用Object.defineProperty。
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage 允许进一步扩展/混入/插件使用
    Sub.extend = Super.extend //不知道这样赋值有什么意义 不是原本就在原型里面有吗 估计是想他独立一个构造函数 使用hasOwnPerproty循环
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    // 创建资产注册，所以扩展类也可以拥有他们的私有资产。
    ASSET_TYPES.forEach(function (type) { //遍历 Vue的filter  Component  directive 放到子级
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup 启用递归自我查找
    if (name) { //这个name不设的话 好像就是组件的id
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    // 在扩展时保留对超级选项的引用。在实例化时我们可以检查超级选项是否已更新。
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)// 浅层复制

    // cache constructor 缓存构造函数
    cachedCtors[SuperId] = Sub
    return Sub
  }
}

function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
