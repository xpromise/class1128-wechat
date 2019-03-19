const express = require('express');
const sha1 = require('sha1');
const { parseString } = require('xml2js');

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

app.use(async (req, res) => {
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
  // console.log(sortedArr);
  // 2）将三个参数字符串拼接成一个字符串进行sha1加密
  const sha1Str = sha1(sortedArr.join(''));
  // console.log(sha1Str);
 
  if (req.method === 'GET') {
    // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (sha1Str === signature) {
      // 说明消息来自于微信服务器
      res.end(echostr);
    } else {
      // 说明消息不是微信服务器
      res.end('error');
    }
  } else if (req.method === 'POST') {
    // 用户发送过来的消息
    // console.log(req.body);  // {}
    // 过滤掉不是微信服务器发送过来的消息
    if (sha1Str !== signature) {
      res.end('error');
      return;
    }
  
    // 获取到了用户发送过来的消息
    const xmlData = await new Promise((resolve, reject) => {
      let xmlData = '';
      req
        .on('data', data => {
          // console.log(data.toString());
          xmlData += data.toString();
          /*
          <xml>
          <ToUserName><![CDATA[gh_4fe7faab4d6c]]></ToUserName> 开发者微信测试号id
          <FromUserName><![CDATA[oAsoR1iP-_D3LZIwNCnK8BFotmJc]]></FromUserName>  用户的openid
          <CreateTime>1552976640</CreateTime> 发送消息的时间戳
          <MsgType><![CDATA[text]]></MsgType> 发送消息的类型
          <Content><![CDATA[222]]></Content>  发送消息具体内容
          <MsgId>22233279597873298</MsgId>    发送消息的id （默认保留3天， 3天后会销毁）
          </xml>
           */
        })
        .on('end', () => {
          //说明数据接受完毕
          resolve(xmlData)
        })
    })
    
    // 将xml数据转换成js对象
    let jsData = null;
    /*
    { xml:
    { ToUserName: [ 'gh_4fe7faab4d6c' ],
     FromUserName: [ 'oAsoR1iP-_D3LZIwNCnK8BFotmJc' ],
     CreateTime: [ '1552977229' ],
     MsgType: [ 'text' ],
     Content: [ '444' ],
     MsgId: [ '22233288777418374' ] } }
     
     -->
     
     { ToUserName: 'gh_4fe7faab4d6c',
     FromUserName: 'oAsoR1iP-_D3LZIwNCnK8BFotmJc',
     CreateTime: '1552977229',
     MsgType: 'text',
     Content: '444',
     MsgId: '22233288777418374'
     }
     */
    parseString(xmlData, {trim: true}, (err, result) => {
      if (!err) {
        jsData = result;
      } else {
        jsData = {};
      }
    })
    
    // 格式化jsData
    const { xml } = jsData;
    let userData = {};
    for (let key in xml) {
      // 获取到属性值
      const value = xml[key];
      // 去掉数组
      userData[key] = value[0];
    }
    console.log(userData);
    
    // 实现自动回复
    let content = '你在说什么？我听不懂';
    
    if (userData.Content === '1') {
      content = '大吉大利，今晚吃鸡';
    } else if (userData.Content.indexOf('2') !== -1) {
      content = '你属什么? \n 我属于你';
    }
    
    let replyMessage = `<xml>
      <ToUserName><![CDATA[${userData.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
    </xml>`;
    
    // 返回响应
    res.send(replyMessage);
    
  } else {
    res.end('error');
  }
  
  
})

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
})