const express = require('express');
const reply = require('./reply');
const app = express();

/*
  1. 验证服务器的有效性：
    - url 开发者服务器地址
      通过ngrok工具将本地地址转化外网能访问的地址（内网穿透）
      指令： ngrok http 3000
    - token 尽量复杂一些就行
    
    微信要求验证开发者服务器的有效性，同样的开发者也得验证消息是否来自于微信服务器
    1）将token、timestamp、nonce三个参数进行字典序排序
    2）将三个参数字符串拼接成一个字符串进行sha1加密
    3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
 */

app.use(reply());

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
})