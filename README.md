# Github Oauth Demo

## 1. 运行示例

申请 oauth 应用: https://github.com/settings/applications/new

`npm install`  

根目录新建 `oauth.config.js`, 内容如下:  

```js
module.exports = {
  clientId: '填入 oauth 应用的 Client ID',
  clientSecret: '填入 oauth 应用的 Client Secret'
}
```

`node src/app.js`

访问: http://localhost:9090

