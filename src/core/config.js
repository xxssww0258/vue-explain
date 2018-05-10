/* @flow */
// 配置文件
import {
  no,// 返回空
  noop,// 不返回
  identity //返回自身
} from 'shared/util'
// 引入生命周期常量
import { LIFECYCLE_HOOKS } from 'shared/constants'

export type Config = {
  // user
  optionMergeStrategies: { [key: string]: Function };
  silent: boolean;
  productionTip: boolean;
  performance: boolean;
  devtools: boolean;
  errorHandler: ?(err: Error, vm: Component, info: string) => void;
  warnHandler: ?(msg: string, vm: Component, trace: string) => void;
  ignoredElements: Array<string | RegExp>;
  keyCodes: { [key: string]: number | Array<number> };

  // platform  接口
  isReservedTag: (x?: string) => boolean;
  isReservedAttr: (x?: string) => boolean;
  parsePlatformTagName: (x: string) => string;
  isUnknownElement: (x?: string) => boolean;
  getTagNamespace: (x?: string) => string | void;
  mustUseProp: (tag: string, type: ?string, name: string) => boolean;

  // legacy
  _lifecycleHooks: Array<string>;
};

export default ({
  /**
   * Option merge strategies (used in core/util/options)
   * 选项合并策略（用于core / util / options）
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   * 是否抑制警告。
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   * 在启动时显示生产模式提示消息
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   * 是否启用devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   * 是否记录性能
   */
  performance: false,

  /**
   * Error handler for watcher errors
   * 观察者错误的错误处理程序
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   * 观察者警告处理程序警告
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   * 忽略某些自定义元素
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   * v-on的自定义用户键别名
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   * 检查一个标签是否被保留，以便它不能被注册为一个组件。 这取决于平台，可能会被覆盖。
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   * 检查属性是否被保留，以便它不能用作组件支柱。 这取决于平台，可能会被覆盖。
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   * 检查标签是否是未知元素。平台依赖性。
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   * 获取元素的名称空间
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   * 解析特定平台的真实标签名称。
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   * 检查属性是否必须使用属性绑定，例如 值 ,平台依赖。
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   * 由于遗留原因而暴露
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
}: Config)
