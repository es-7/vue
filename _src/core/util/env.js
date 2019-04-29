/* @flow */

/**
 *  当前环境是否支持 __proto__ 属性;有些浏览器不能让你明目张胆的使用 __proto__
 */
export const hasProto = '__proto__' in {}

/**
 *  判断是否浏览器
 */
export const inBrowser = typeof window !== 'undefined'
/**
 *  判断是否Weex环境
 */
export const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform
/**
 *  获取运行Weex环境小写
 */
export const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()
/**
 *  获取ua小写
 */
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
/**
 *  是否ie
 */
export const isIE = UA && /msie|trident/.test(UA)
/**
 *  是否ie9
 */
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
/**
 *  是否edge
 */
export const isEdge = UA && UA.indexOf('edge/') > 0
/**
 *  是否安卓环境
 */
export const isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android')
/**
 *  是否ios环境
 */
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios')
/**
 *  是否chrome
 */
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
/**
 *  是否PhantomJS环境  ps:PhantomJS是一个无界面的webkit内核浏览器，你可以把它当作一个没有界面的Safari
 */
export const isPhantomJS = UA && /phantomjs/.test(UA)
/**
 *  是否火狐
 */
export const isFF = UA && UA.match(/firefox\/(\d+)/)
/**
 *  火狐下有Object.prototype.watch 是一个方法
 */
export const nativeWatch = ({}).watch

/**
 *  passive表示listener永远不会调用preventDefault()。如果listener仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告
 *  尝试 设置supportsPassive为true
 */
export let supportsPassive = false
if (inBrowser) {
  try {
    const opts = {}
    Object.defineProperty(opts, 'passive', ({
      get () {
        /* istanbul ignore next */
        supportsPassive = true
      }
    }: Object)) // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts)
  } catch (e) {}
}

/**
 *  这个需要延迟加载, 因为在 vue服务器渲染设置VUE_ENV环境之前, 需要先加载vue
 */
let _isServer
export const isServerRendering = () => {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }
  return _isServer
}

/**
 *  devtools 是否存在
 */
export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

/**
 *  是否是原生方法  先判断typeof 是否存在 然后 toString 是否含有 native code
 */
export function isNative (Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
/**
 *  是否支持symbol Reflect
 */
export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)

/**
 *  支持set，_set为set,不支持就用pollify去写，克隆一个无继承的对象，在其原型链上设置has,add,clear函数
 */

let _Set

if (typeof Set !== 'undefined' && isNative(Set)) {
  _Set = Set
} else {

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

export interface SimpleSet {
  has(key: string | number): boolean;
  add(key: string | number): mixed;
  clear(): void;
}

export { _Set }
