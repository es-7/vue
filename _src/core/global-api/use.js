/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  /**
   * 安装vue插件 可以传入 函数  或者 对象
   */
  Vue.use = function (plugin: Function | Object) {
    /**
     * 首先判断是否被注册过,保证相同的插件不会重复注册
     */
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    /**
     *  用 toArray 得到参数数组  除第一个参数外 剩余的参数赋值给args  然后将Vue插入第一个 保证install执行的第一个参数是vue
     */
    const args = toArray(arguments, 1)
    args.unshift(this)

    /**
     *  支持两种方式  可以是一个包含install的对象 或者 本身当做install函数
     */
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }

    /**
     *  插件保存到installedPlugins中 便于查重
     */
    installedPlugins.push(plugin)
    return this
  }
}
