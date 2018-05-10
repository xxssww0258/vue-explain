/* @flow */

/**
 * Check if a string starts with $ or _
 * 检查一个字符串是以$或_开头的
 */
export function isReserved (str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 * 定义一个属性
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * Parse simple path.
 * 解析简单的路径。
 */
 // 给传进来的对象插入 www baidu com 3个键值对 都是undefined
const bailRE = /[^\w.$]/ // 不包含 a-zA-Z0-9 . $ 
export function parsePath (path: string): any {
  if (bailRE.test(path)) { // 判断是不是路径
    return
  }
  const segments = path.split('.')//www.baidu.com  ['www','baidu','com']
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
