// # Vue 实例对象
vue = {
  $attrs:{},
  $createElement:fn(),
  $listeners:{}, //听众?

  $slots:{},//插槽
  $scopedSlots:{},//范围内的插槽

  $el:Element, //挂摘的dom 对象
  $refs:{ refName:Element }, 

  $parent:{VueComponent},
  $root:{VueComponent},
  $children:[
    {VueComponent},
    {VueComponent},
    {VueComponent},
  ],
//======================================== _ ========================================
  _c:fn(),
  _data:{__ob__:Observer},
  _directInactive:false,//直接无线
  _events:{},
  _hasHookEvent:{}, //拥有钩事件
  _inactive:null,//待用 
  _isBeingDestroyed:false,//正在毁坏
  _isDestroyed:false, //已经摧毁
  _isMounted:true,//创建完毕
  _isVue:true,// 是否vue对象
  _renderProxy:{Proxy},
  _routerRoot:{Vue},
  _self:{VueComponent},
  _staticTrees:[VNODE],
  _uid : 2,
  _vnode:{VNODE},
  _watcher:{Watcher},
  _watchers:[
    {Watcher},
    {Watcher},
  ],
  //======================================== $ ========================================
  $data:{},
  $isServer:false,
  //======================================== options ========================================
  $options:{
    parent:{VueComponent},
    propsData,
    _componentTag,
    _parentElm,
    _parentListeners,
    _parentVnode,
    _refElm,
    _renderChildren,
    __proto__:{ // 原型里面一堆函数
      beforeCreate:[fn(),fn().fn()],
      beforeDestroy:[fn()],
      created:[fn()],
      mounted:[fn()],
      destroyed:[fn()],
      mixins:[fn()],
      data:fn(),
      render:fn(),
      staticRenderFns:fn(),
      _Ctor:{0:function VueComponent(options) {
        this._init(options);
      }},
      __file:"src/view/product-sale.vue", // 文件路径
      _base:VueComponentFn(),
      _compiled:true,
      _scopeId:'data-v-e31e78f4',
      name:'',
      components:{// 组件 是一个纯对象
        componentNames:{VueComponent},
        [main.js]:fn()//这是一个入口文件的vue 函数
      },
      directives:{// 指令

      },
      filters:{ // 过滤

      }
    }
  },
  //======================================== vnode ========================================
  $vnode:{

  },
  //======================================== 大概的对象 ========================================
  
}