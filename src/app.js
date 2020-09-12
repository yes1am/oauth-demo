const express = require('express')
const app = express()
const path = require('path')
const port = 9090
const rp = require('request-promise');
const cache = require('./cache');
const { clientId, clientSecret } = require('../oauth.config');

const authorizeUrl = 'https://github.com/login/oauth/authorize';
const redirectUrl = `http://localhost:${port}/oauth/redirect`;

//设置模板文件文件夹
app.set('views', path.resolve(__dirname, './views'))
//设置视图模板后缀名为 .html, 使用 res.render('xx') 来代替 res.render("xx.html")
app.set('view engine', 'html');
//注册 ejs 模板的后缀为 .html
app.engine('.html', require('ejs').__express);

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.render('index', {
    clientId,
    authorizeUrl,
    redirectUrl
  })
})

app.get('/oauth/redirect', async (req, res) => {
  // 返回授权码
  const requestToken = req.query.code;

  try {
    // 返回 accessToken
    const tokenResponse = cache.get(requestToken, null) || await rp({
      method: 'POST',
      uri: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${requestToken}`,
      json: true
    });

    // 缓存 accessToken
    const accessToken = tokenResponse ? tokenResponse.access_token : '';
    if(!accessToken) {
      res.send(tokenResponse.error_description || 'no accessToken');
      return;
    } else {
      cache.set(requestToken, tokenResponse)
    }

    const userData = cache.get(accessToken, null) || await rp({
      uri: `https://api.github.com/user`,
      headers: {
        accept: 'application/vnd.github.v3+json',
        'User-Agent': 'github.com/yes1am',
        Authorization: `token ${accessToken}`
      },
      json: true
    });

    const {
      name: userName,
      avatar_url: avatar,
      html_url: userLink,
      location,
      bio
    } = userData || {};

    if(userData) {
      cache.set(accessToken, userData);
      res.render('user', {
        userName,
        avatar,
        userLink,
        location,
        bio
      })
    } else {
      res.send('获取用户信息失败!')
    }
  } catch (e) {
    console.log('出错了', e);
    res.send(e)
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})