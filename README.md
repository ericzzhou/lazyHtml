# eric-lazyhtml


A lazy loading library of html elements for web development

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |



## Installing

Using npm:

```bash
$ npm install eric-lazyhtml
```

Using bower:

```bash
$ bower install eric-lazyhtml
```

Using yarn:

```bash
$ yarn add eric-lazyhtml
```

Using jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/eric-lazyhtml/dist/lazyhtml.min.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/eric-lazyhtml/dist/lazyhtml.min.js"></script>
```

## Example

### note: Web usage
一个简单的示例是在你的页面上填充需要延迟加载的元素配置，使用JSON配置
```html
<div class="container loading" lazy style="--color:purple">
    <script type="application/json">
        {
            "method": "ajax",
            "target": "div > div.content",
            "response": {
                "method": "get",
                "type": "html",
                "url": "https://www.yamibuy.com/robots.txt",
                "headers": [],
                "body": ""
            }
        }
    </script>
    <div class="p">
        <div>这里组件原本的内容</div>
        <div class="content"></div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/eric-lazyhtml/dist/lazyhtml.min.js"></script>
<script>
    let lazyHtml = new LazyHtml('body', {
        distance: 50,
        attr: 'lazy',
        lazy: true,
        onLoad: function () {
            document.querySelectorAll('[lazy="loaded"]').forEach(function (item) {
                item.classList.remove('loading');
            });
            console.log('onLoad 回调执行', arguments);
        }
    });
    lazyHtml.init();
    </script>

```


```js

```

## lazyHtml API

lazyHtml 支持JSON配置，用来配置相关行为。

### 使用建议
- 在页面绘制需要延迟加载的元素容器（固定高度可以大幅度缓解CLS问题）
- 在元素上添加 lazy 属性，lazyhtml库将会监听设置了lazy属性的元素
- 在元素容器内部使用JSON配置需要请求的数据，以及远端数据返回后替换的页面元素
- 设置元素加载完成后的回调事件
##### axios(config)

```js
// Send a POST request
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

参数说明：
```js
distance: 50, // 控制元素加载时机，距离出现在屏幕视窗50px时加载
attr: 'lazy', //控制 lazyhtml 监听的元素属性
lazy: true, //
onLoad: function () { // lazyhtml 监听并成功执行数据填充后的回调函数
    document.querySelectorAll('[lazy="loaded"]').forEach(function (item) {
        item.classList.remove('loading');
    });
    console.log('onLoad 回调执行', arguments);
}
```


## License

[MIT](LICENSE)
