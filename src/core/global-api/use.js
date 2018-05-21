/* @flow */
// use 插件的模块
import { toArray } from '../util/index'
// 赋予传进来的对象有一个use的函数 
  // use函数 会把 插件执行完毕后 push到installedPlugins
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 检测之类的
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters 附加参数
    const args = toArray(arguments, 1)// 将类似数组的对象转换为真实的数组。
    args.unshift(this) // 添加this 到数组头部
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)// 传参args执行
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this //返回Vue
  }
}
