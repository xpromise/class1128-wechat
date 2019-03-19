const express = require('express');
const sha1 = require('sha1');
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

app.use((req, res) => {
  //微信服务器发送过来的请求参数
  console.log(req.query);
  /*
    { signature: 'efd377ff6ad1a1d57accc6d1848f1c7b9b9077f2',   微信加密签名
    echostr: '4809389192886745081', 微信后台生成的随机字符串
    timestamp: '1552966105',  微信后台发送请求的时间戳
    nonce: '1780047115' }     微信后台生成的随机数字
   */
  const { signature, echostr, timestamp, nonce } = req.query;
  const token = 'atguiguHTML1128';
  // 1）将token、timestamp、nonce三个参数进行字典序排序
  const sortedArr = [token, timestamp, nonce].sort();
  console.log(sortedArr);
  // 2）将三个参数字符串拼接成一个字符串进行sha1加密
  const sha1Str = sha1(sortedArr.join(''));
  console.log(sha1Str);
  // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (sha1Str === signature) {
    // 说明消息来自于微信服务器
    res.end(echostr);
  } else {
    // 说明消息不是微信服务器
    res.end('error');
  }
  
})

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
})