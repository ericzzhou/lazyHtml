/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["LazyHtml"] = factory();
	else
		root["LazyHtml"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// const LazyHtml = require(\"./lib/lazyHtml\");\r\n// module.exports = LazyHtml;\r\n// module.exports.default = LazyHtml\r\n\r\nmodule.exports = __webpack_require__(/*! ./lib/lazyHtml */ \"./lib/lazyHtml.js\");\n\n//# sourceURL=webpack://LazyHtml/./index.js?");

/***/ }),

/***/ "./lib/handler/AjaxHandler.js":
/*!************************************!*\
  !*** ./lib/handler/AjaxHandler.js ***!
  \************************************/
/***/ ((module) => {

eval("class AjaxHandler {\r\n    constructor(element, config) {\r\n      this.element = element;\r\n  \r\n      this.config = config;\r\n      console.log(element, config);\r\n    }\r\n  \r\n    /**\r\n     *\r\n     * @returns {Object} 返回对象 { type , content }\r\n     */\r\n    async init() {\r\n      // https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html\r\n      let fetchConfig = {\r\n        method: this.config.response.method,\r\n        headers: this.config.response.headers,\r\n      };\r\n  \r\n      if (this.config.response.method === \"POST\") {\r\n        fetchConfig.body = this.config.response.body;\r\n      }\r\n      let response = await fetch(this.config.response.url, fetchConfig);\r\n      let result;\r\n      if (this.config.response.type === \"html\") {\r\n        result = await response.text();\r\n        this.DrawHtml(result);\r\n      } else {\r\n        result = await response.json();\r\n      }\r\n      return {\r\n        type: this.config.response.responseType,\r\n        content: result,\r\n      };\r\n    }\r\n  \r\n    DrawHtml(html) {\r\n      if (!this.element) return;\r\n  \r\n      if (\r\n        this.config &&\r\n        this.config.target &&\r\n        this.element.querySelector(this.config.target)\r\n      ) {\r\n        this.element.querySelector(this.config.target).innerHTML = html;\r\n      } else {\r\n        this.element.innerHTML = html;\r\n      }\r\n    }\r\n  }\r\n  \r\n\r\n  module.exports = AjaxHandler;\r\n  module.exports[\"default\"] = AjaxHandler;\n\n//# sourceURL=webpack://LazyHtml/./lib/handler/AjaxHandler.js?");

/***/ }),

/***/ "./lib/lazyHtml.js":
/*!*************************!*\
  !*** ./lib/lazyHtml.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const AjaxHandler = __webpack_require__(/*! ./handler/AjaxHandler */ \"./lib/handler/AjaxHandler.js\");\r\n\r\nclass LazyHtml {\r\n  constructor(element, options = { distance: 0, lazy: true, attr: \"lazy\" }) {\r\n    this.element = document.querySelector(element);\r\n\r\n    this.options = options;\r\n  }\r\n\r\n  /**\r\n   * 分发不同处理类型\r\n   * @param {*} config\r\n   * @param {*} element\r\n   */\r\n  async dispatch(config, element) {\r\n    let { method, response } = config;\r\n    let result = null; // 初始化返回结果\r\n    switch (method) {\r\n      case \"ajax\":\r\n        result = await new AjaxHandler(element, config).init();\r\n        break;\r\n      default:\r\n        console.info(\"没有匹配到正确的分发器\", config);\r\n        break;\r\n    }\r\n\r\n    return result;\r\n  }\r\n\r\n  //监听页面滚动\r\n  listenScroll(callback) {\r\n    window.addEventListener(\"scroll\", callback);\r\n  }\r\n  //取消页面滚动监听\r\n  unlistenScroll(callback) {\r\n    window.removeEventListener(\"scroll\", callback);\r\n  }\r\n\r\n  // 初始化\r\n  init() {\r\n    let lazyFun = this.lazyLoad.bind(this); // 将lazyLoad方法绑定到当前对象上\r\n    lazyFun(); //页面加载时执行一次lazyLoad方法\r\n    let scrollCallback = this.throttle(lazyFun); // 节流函数是一个闭包，返回方法，执行时调用方法\r\n    this.listenScroll(scrollCallback);\r\n  }\r\n\r\n  // 节流函数，带有节流阀的函数，只有在节流阀打开时才执行\r\n  throttle(fn, delay = 500) {\r\n    let timer = null;\r\n    return function () {\r\n      if (!timer) {\r\n        timer = setTimeout(() => {\r\n          fn();\r\n          timer = null;\r\n        }, delay);\r\n      }\r\n    };\r\n  }\r\n\r\n  // html 元素懒加载，设置lazy属性，如果距离出现在可视区域，则执行渲染\r\n  lazyLoad() {\r\n    let lazyElements = this.getLazyElements();\r\n\r\n    if (lazyElements.length === 0) return;\r\n\r\n    let scrollTop =\r\n      document.documentElement.scrollTop || document.body.scrollTop;\r\n    let clientHeight = document.documentElement.clientHeight;\r\n    lazyElements.forEach((element) => {\r\n      let offsetTop = element.offsetTop;\r\n      let offsetHeight = element.offsetHeight;\r\n\r\n      let distance = this.options.distance;\r\n\r\n      /**\r\n       * 如果元素距离页面顶部距离小于设置的距离(滚动条+视窗高度+缓冲距离)，则认为元素已经出现在可视区域\r\n       */\r\n\r\n      if (\r\n        offsetTop + offsetHeight + distance > scrollTop &&\r\n        offsetTop < scrollTop + clientHeight + distance\r\n      ) {\r\n        try {\r\n          let jsonStr = element.querySelector(\r\n            'script[type=\"application/json\"]'\r\n          ).textContent;\r\n          console.log(\"json 配置内容\", jsonStr);\r\n          let config = JSON.parse(jsonStr);\r\n\r\n          this.dispatch(config, element).then((res) => {\r\n            this.setLazyAttr(element, \"loaded\");\r\n            this.options.onLoad(element, config, this.options);\r\n          });\r\n        } catch (e) {\r\n          console.error(\r\n            `没有发现元素配置，请检查元素内是否有 <script type=\"application/json\"> 标签，并且内容是 JSON 格式`,\r\n            element,\r\n            e\r\n          );\r\n        }\r\n      }\r\n    });\r\n  }\r\n\r\n  //获取页面包含需要监听lazy属性的元素\r\n  getLazyElements() {\r\n    return this.element.querySelectorAll(\r\n      `[${this.options.attr}]:not([${this.options.attr}=\"loaded\"])`\r\n    );\r\n  }\r\n\r\n  //设置元素lazy属性\r\n  setLazyAttr(element, attr) {\r\n    element.setAttribute(this.options.attr, attr);\r\n  }\r\n\r\n  //防抖函数\r\n  debounce(fn) {\r\n    let timer = null;\r\n    return function () {\r\n      if (timer) {\r\n        clearTimeout(timer);\r\n      }\r\n      timer = setTimeout(() => {\r\n        fn();\r\n      }, 500);\r\n    };\r\n  }\r\n}\r\n\r\n\r\nmodule.exports = LazyHtml;\r\nmodule.exports[\"default\"] = LazyHtml;\n\n//# sourceURL=webpack://LazyHtml/./lib/lazyHtml.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});