import { inBrowser } from './env'

export let mark
export let measure

/**
 * 如果不是线上环境
 *  performance.mark(name) 根据给出 name 值，在浏览器的性能输入缓冲区中创建一个相关的timestamp
 *  Performance.measure(name,start mark ,end mark)   在浏览器的指定 start mark 和 end mark 间的性能输入缓冲区中创建一个指定的 timestamp
 *   performance.clearMarks(name) 将给定的 mark 从浏览器的性能输入缓冲区中移除。
 *
 *  生成两个函数 pref 和 measure
 */
if (process.env.NODE_ENV !== 'production') {
  const perf = inBrowser && window.performance
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = tag => perf.mark(tag)
    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
    }
  }
}
