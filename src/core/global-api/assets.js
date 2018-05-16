/* @flow */

import { ASSET_TYPES } from 'shared/constants' // 资源类型 分辨 是指令还是过滤 还是组件
import { isPlainObject, validateComponentName } from '../util/index'


// 传入一个全局的Vue
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   * 创建资产注册方法。
   */
  ASSET_TYPES.forEach(type => { //  指令 过滤 组件
    Vue[type] = function (
      id: string,// 传入一个指令的id 
      definition: Function | Object //参数
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        // 如果是组建且不是生产环境 就检测一下名字是不是有效的
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // 如果是组件 且  参数是一个对象
        if (type === 'component' && isPlainObject(definition)) {
          // 修改name   值 
          definition.name = definition.name || id
          // 返回一个生成组件的函数
          definition = this.options._base.extend(definition) // 这句看不懂
        }
        // 如果是一个指令 且参数 一个函数 就把他修改成一个对象
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }// 看不太懂他想干嘛
        }
        this.options[type + 's'][id] = definition
        // 修改完毕后丢回去
        return definition 
      }
    }
  })
}
