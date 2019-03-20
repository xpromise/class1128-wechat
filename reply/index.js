/*
  中间件函数模块： 接受请求，返回响应
 */
const sha1 = require('sha1');
const { getUserDataAsync, parseXMLData, formatJsData } = require('../utils/tools');
const template = require('./template');
const handleResponse = require('./handleResponse');

module.exports = () => {
  
  return async (req, res) => {
    //微信服务器发送过来的请求参数
    const { signature, echostr, timestamp, nonce } = req.query;
    const token = 'atguiguHTML1128';
    //通过微信签名算法加密出来微信签名
    const sha1Str = sha1([token, timestamp, nonce].sort().join(''));
  
    if (req.method === 'GET') {
      // 处理验证服务器消息有效性
      if (sha1Str === signature) {
        // 说明消息来自于微信服务器
        res.end(echostr);
      } else {
        // 说明消息不是微信服务器
        res.end('error');
      }
    } else if (req.method === 'POST') {
      // 处理用户发送过来的消息
      // 过滤掉不是微信服务器发送过来的消息
      if (sha1Str !== signature) {
        res.end('error');
        return;
      }
      // 获取到了用户发送过来的消息
      const xmlData = await getUserDataAsync(req);
      // 将xml数据转换成js对象
      const jsData = parseXMLData(xmlData);
      // 格式化jsData
      const userData = formatJsData(jsData);
      // 处理用户发送的消息，定义响应的数据
      const options = handleResponse(userData);
      // 用于定义回复用户消息的6种模板模块
      const replyMessage = template(options);
      // 如果响应错误， 看打印结果是否错误
      console.log(replyMessage);
      // 返回响应
      res.send(replyMessage);
    
    } else {
      res.end('error');
    }
  
  }
}