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

eval("const AjaxHandler = __webpack_require__(/*! ./handler/AjaxHandler */ \"./lib/handler/AjaxHandler.js\");\n\nclass LazyHtml {\n  constructor(element, options = { distance: 0, lazy: true, attr: \"lazy\" }) {\n    this.element = document.querySelector(element);\n\n    this.options = options;\n  }\n\n  /**\n   * 分发不同处理类型\n   * @param {*} config\n   * @param {*} element\n   */\n  async dispatch(config, element) {\n    let { method, response } = config;\n    let result = null; // 初始化返回结果\n    switch (method) {\n      case \"ajax\":\n        result = await new AjaxHandler(element, config).init();\n        break;\n      default:\n        console.info(\"没有匹配到正确的分发器\", config);\n        break;\n    }\n\n    return result;\n  }\n\n  //监听页面滚动\n  listenScroll(callback) {\n    window.addEventListener(\"scroll\", callback);\n  }\n  //取消页面滚动监听\n  unlistenScroll(callback) {\n    window.removeEventListener(\"scroll\", callback);\n  }\n\n  // 初始化\n  init() {\n    let lazyFun = this.lazyLoad.bind(this); // 将lazyLoad方法绑定到当前对象上\n    lazyFun(); //页面加载时执行一次lazyLoad方法\n    let scrollCallback = this.throttle(lazyFun); // 节流函数是一个闭包，返回方法，执行时调用方法\n    this.listenScroll(scrollCallback);\n  }\n\n  // 节流函数，带有节流阀的函数，只有在节流阀打开时才执行\n  throttle(fn, delay = 500) {\n    let timer = null;\n    return function () {\n      if (!timer) {\n        timer = setTimeout(() => {\n          fn();\n          timer = null;\n        }, delay);\n      }\n    };\n  }\n\n  // html 元素懒加载，设置lazy属性，如果距离出现在可视区域，则执行渲染\n  lazyLoad() {\n    let lazyElements = this.getLazyElements();\n\n    if (lazyElements.length === 0) return;\n\n    let scrollTop =\n      document.documentElement.scrollTop || document.body.scrollTop;\n    let clientHeight = document.documentElement.clientHeight;\n    lazyElements.forEach((element) => {\n      let offsetTop = element.offsetTop;\n      let offsetHeight = element.offsetHeight;\n\n      let distance = this.options.distance;\n\n      /**\n       * 如果元素距离页面顶部距离小于设置的距离(滚动条+视窗高度+缓冲距离)，则认为元素已经出现在可视区域\n       */\n\n      if (\n        offsetTop + offsetHeight + distance > scrollTop &&\n        offsetTop < scrollTop + clientHeight + distance\n      ) {\n        try {\n          let jsonStr = element.querySelector(\n            'script[type=\"application/json\"]'\n          ).textContent;\n          console.log(\"json 配置内容\", jsonStr);\n          let config = JSON.parse(jsonStr);\n\n          this.dispatch(config, element).then((res) => {\n            this.setLazyAttr(element, \"loaded\");\n            this.options.onLoad(element, config, this.options);\n          });\n        } catch (e) {\n          console.error(\n            `没有发现元素配置，请检查元素内是否有 <script type=\"application/json\"> 标签，并且内容是 JSON 格式`,\n            element,\n            e\n          );\n        }\n      }\n    });\n  }\n\n  //获取页面包含需要监听lazy属性的元素\n  getLazyElements() {\n    return this.element.querySelectorAll(\n      `[${this.options.attr}]:not([${this.options.attr}=\"loaded\"])`\n    );\n  }\n\n  //设置元素lazy属性\n  setLazyAttr(element, attr) {\n    element.setAttribute(this.options.attr, attr);\n  }\n\n  //防抖函数\n  debounce(fn) {\n    let timer = null;\n    return function () {\n      if (timer) {\n        clearTimeout(timer);\n      }\n      timer = setTimeout(() => {\n        fn();\n      }, 500);\n    };\n  }\n}\n\n\nmodule.exports = LazyHtml;\nmodule.exports[\"default\"] = LazyHtml;\n\n//# sourceURL=webpack://LazyHtml/./lib/lazyHtml.js?");

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