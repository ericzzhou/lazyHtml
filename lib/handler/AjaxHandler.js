class AjaxHandler {
    constructor(element, config) {
      this.element = element;
  
      this.config = config;
      console.log(element, config);
    }
  
    /**
     *
     * @returns {Object} 返回对象 { type , content }
     */
    async init() {
      // https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html
      let fetchConfig = {
        method: this.config.response.method,
        headers: this.config.response.headers,
      };
  
      if (this.config.response.method === "POST") {
        fetchConfig.body = this.config.response.body;
      }
      let response = await fetch(this.config.response.url, fetchConfig);
      let result;
      if (this.config.response.type === "html") {
        result = await response.text();
        this.DrawHtml(result);
      } else {
        result = await response.json();
      }
      return {
        type: this.config.response.responseType,
        content: result,
      };
    }
  
    DrawHtml(html) {
      if (!this.element) return;
  
      if (
        this.config &&
        this.config.target &&
        this.element.querySelector(this.config.target)
      ) {
        this.element.querySelector(this.config.target).innerHTML = html;
      } else {
        this.element.innerHTML = html;
      }
    }
  }
  

  module.exports = AjaxHandler;
  module.exports.default = AjaxHandler;