class LazyHtml {
  constructor(element, options = { distance: 0 }) {
    this.element = document.querySelector(element);

    this.options = options;
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

  // html 元素懒加载，设置lazy属性，入参是距离页面出现的距离
  lazyLoad() {
    let lazyElements = this.getLazyElements();
    let distance = this.options.distance | 0; //获取距离页面出现的距离
    
    if(lazyElements.length === 0) return;

    for (let i = 0; i < lazyElements.length; i++) {
      let element = lazyElements[i];
      let elementTop = element.getBoundingClientRect().top;
      if (elementTop < distance) {
        console.log(elementTop);
        console.log('元素出现');
        this.setLazyAttr(element, "loaded");
      }
    }
  }

  //获取页面包含lazy属性的元素
  getLazyElements() {
    return this.element.querySelectorAll("[lazy]");
  }

  //设置元素lazy属性
  setLazyAttr(element, attr) {
    element.setAttribute("lazy", attr);
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
