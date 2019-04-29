/* @flow */

/**
 * 声明一个 不能添加检测属性的 空对象
 */
export const emptyObject = Object.freeze({})

/**
 * 判断某变量不存在
 */
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}

/**
* 判断某变量存在
*/
export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
}

/**
 * 强判断 必需是true
 */
export function isTrue (v: any): boolean %checks {
  return v === true
}

/**
 * 强判断 必需是false
 */
export function isFalse (v: any): boolean %checks {
  return v === false
}

/**
 *  是否原始属性  基本和 isUndef配合使用  共同检测6种按值传递的基本类型
 */
export function isPrimitive (value: any): boolean %checks {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * 判断是否是 非null对象
 */
export function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}

/**
 * toString引用
 */
const _toString = Object.prototype.toString

/**
 * 获取toString的返回的对象类型
 */
export function toRawType (value: any): string {
  return _toString.call(value).slice(8, -1)
}

/**
 * 检查是不是纯粹对象 (由{}或者 new Object创建)
 */
export function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}

/**
 * 检查是不是正则对象
 */
export function isRegExp (v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * 判断一个索引是否 为 合法索引(非负整数 向下取整等于自身 且为有限值)
 */
export function isValidArrayIndex (val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * 判断是否promise对象
 */
export function isPromise (val: any): boolean {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 *  实际渲染的toString null和undefined会被忽略为''
 */
export function toString (val: any): string {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * 将输入值转换为数字
 * 如果失败 返回原值
 */
export function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**
 * 根据传入的 str 和 boolean 类型
 * 生成一个函数 检测是否为内部属性或标签
 * boolean类型 决定是否忽略大小写
 */
export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

/**
 * 检查一个标签是否为 内置标签
 */
export const isBuiltInTag = makeMap('slot,component', true)

/**
 * 检查一个属性是否为 预留属性
 */
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**
 * 从数组中删除某元素
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * 检查某对象 是否含某自有属性
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<*>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

/**
 * 将纯函数计算结果 缓存起来
 */
export function cached<F: Function> (fn: F): F {
  const cache = Object.create(null)
  return (function cachedFn (str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }: any)
}

/**
 * 功能函数: 将a_b 转换为 aB 驼峰
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 *  功能函数: 首字母大写
 */
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 *   功能函数: 驼峰反转 将aB 转换为 a_b  ps:\B非单词边界  \b单词边界
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * 向下兼容 支持bind
 */
function polyfillBind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}

/**
 * 浏览器自身支持的函数
 */
function nativeBind (fn: Function, ctx: Object): Function {
  return fn.bind(ctx)
}

/**
 * 改写了bind函数 ,第一个参数为 fn  第二个参数为ctx
 */
export const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind

/**
 * 将一个类数组对象 转化为数组
 */
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * 简单的覆盖继承属性
 */
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

/**
 * 将一个对象数组 合并成单个对象 属性顺序覆盖继承
 */
export function toObject (arr: Array<any>): Object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 *  空函数引用
 */
export function noop (a?: any, b?: any, c?: any) {}

/**
 *   永远返回false
 */
export const no = (a?: any, b?: any, c?: any) => false

/* eslint-enable no-unused-vars */

/**
 *  来什么 返回什么
 */
export const identity = (_: any) => _

/**
 *  从 编译器模块 生成包含 静态键 的字符串
 */
export function genStaticKeys (modules: Array<ModuleOptions>): string {
  return modules.reduce((keys, m) => {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * 对比对象的值 是否是相等的 (不判断指向)
 * 如果 a === b 返回true
 *    否则  如果 a b 都是非空对象
 *               如果a b 都是数组对象
 *                    判断数组长度相等
 *                   递归对比数组中元素
 *               如果a b 都是时间类型
 *                   对比 a b的时间戳
 *               如果 a b 是对象类型
 *                   判断key长度
 *                   递归对比每个key 和对应的value
 *     否者 如果 a 和 b 不是 非空对象
 *             直接对比String后的值
 *     否者  返回false
 *
 */
export function looseEqual (a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * 判断一个对象在 一个数组相同值中的索引  宽松比较
 */
export function looseIndexOf (arr: Array<mixed>, val: mixed): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

/**
 * 确保一个函数只会被调用一次
 */
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
