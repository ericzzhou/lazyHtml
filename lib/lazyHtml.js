const AjaxHandler = require('./handler/AjaxHandler');

class LazyHtml {
  constructor(element, options = { distance: 0, lazy: true, attr: "lazy" }) {
    this.element = document.querySelector(element);

    this.options = options;
  }

  /**
   * 分发不同处理类型
   * @param {*} config
   * @param {*} element
   */
  async dispatch(config, element) {
    let { method, response } = config;
    let result = null; // 初始化返回结果
    switch (method) {
      case "ajax":
        result = await new AjaxHandler(element, config).init();
        break;
      default:
        console.info("没有匹配到正确的分发器", config);
        break;
    }

    return result;
  }

  //监听页面滚动
  listenScroll(callback) {
    window.addEventListener("scroll", callback);
  }
  //取消页面滚动监听
  unlistenScroll(callback) {
    window.removeEventListener("scroll", callback);
  }

  // 初始化
  init() {
    let lazyFun = this.lazyLoad.bind(this); // 将lazyLoad方法绑定到当前对象上
    lazyFun(); //页面加载时执行一次lazyLoad方法
    let scrollCallback = this.throttle(lazyFun); // 节流函数是一个闭包，返回方法，执行时调用方法
    this.listenScroll(scrollCallback);
  }

  // 节流函数，带有节流阀的函数，只有在节流阀打开时才执行
  throttle(fn, delay = 500) {
    let timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          fn();
          timer = null;
        }, delay);
      }
    };
  }

  // html 元素懒加载，设置lazy属性，如果距离出现在可视区域，则执行渲染
  lazyLoad() {
    let lazyElements = this.getLazyElements();

    if (lazyElements.length === 0) return;

    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    let clientHeight = document.documentElement.clientHeight;
    lazyElements.forEach((element) => {
      let offsetTop = element.offsetTop;
      let offsetHeight = element.offsetHeight;

      let distance = this.options.distance;

      /**
       * 如果元素距离页面顶部距离小于设置的距离(滚动条+视窗高度+缓冲距离)，则认为元素已经出现在可视区域
       */

      if (
        offsetTop + offsetHeight + distance > scrollTop &&
        offsetTop < scrollTop + clientHeight + distance
      ) {
        try {
          let jsonStr = element.querySelector(
            'script[type="application/json"]'
          ).textContent;
          console.log("json 配置内容", jsonStr);
          let config = JSON.parse(jsonStr);

          this.dispatch(config, element).then((res) => {
            this.setLazyAttr(element, "loaded");
            this.options.onLoad(element, config, this.options);
          });
        } catch (e) {
          console.error(
            `没有发现元素配置，请检查元素内是否有 <script type="application/json"> 标签，并且内容是 JSON 格式`,
            element,
            e
          );
        }
      }
    });
  }

  //获取页面包含需要监听lazy属性的元素
  getLazyElements() {
    return this.element.querySelectorAll(
      `[${this.options.attr}]:not([${this.options.attr}="loaded"])`
    );
  }

  //设置元素lazy属性
  setLazyAttr(element, attr) {
    element.setAttribute(this.options.attr, attr);
  }

  //防抖函数
  debounce(fn) {
    let timer = null;
    return function () {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn();
      }, 500);
    };
  }
}


module.exports = LazyHtml;
module.exports.default = LazyHtml;