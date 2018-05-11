/* @flow */
/* globals MessageChannel 全局消息通道*/

// 大概做的事情就是 出口一个 nexttick 函数 然后传入函数 和 环境  然后 MessageChannel 放入同一个micro task

import { noop } from 'shared/util'
import { handleError } from './error'
import { isIOS, isNative } from './env'

const callbacks = []  // 这里面接受了一堆 nextTick 的回调事件
let pending = false //有待 未决定
// 刷新回调 执行回调数组
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)// 应该是复制数组
  callbacks.length = 0//清除掉事件回调
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
//  在这里，我们使用microtasks和（宏）任务推迟包装。
//  在<2.4我们在任何地方都使用微任务，但是有些情况下微任务的优先级太高，
//  顺序事件（例如＃4521，＃6690）或者甚至在相同的冒泡之间
//  事件（＃6566）。 然而，在任何地方使用（宏）任务也存在微妙的问题
//  当状态在重新绘制之前立即改变（例如＃6813，外出过渡）。
//  这里我们默认使用microtask，但是在需要的时候暴露一种强制（宏）任务的方式（例如，在v-on附加的事件处理程序中）。
let microTimerFunc //微型定时器功能
let macroTimerFunc //宏定时器功能
let useMacroTask = false

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
// 确定（宏）任务推迟实施。
// 技术上讲，立即应该是理想的选择，但它是唯一可用的
// 在IE中 唯一的polyfill在所有DOM之后始终排队回调
// 在同一个循环中触发的事件是通过使用MessageChannel。
/* istanbul ignore if */   // 判断是否 拥有setImmediate   node  有
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (// 这里有原生的判断 没去看
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */ // 实在不行就是走 task
  macroTimerFunc = () => { 
    setTimeout(flushCallbacks, 0)  //把回调放入task event loop
  }
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {// 这里有原生的判断 没去看
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc  // 默认 宏事件也是微事件
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 * 包装一个函数，以便如果触发器内的任何代码状态发生更改，则使用（宏）任务而不是微任务对这些更改进行排队。
 */
export function withMacroTask (fn: Function): Function {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}

export function nextTick (cb?: Function, ctx?: Object) { //ctx 环境上下文
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
