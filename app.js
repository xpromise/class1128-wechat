const express = require('express');
const sha1 = require('sha1');
const reply = require('./reply');
const fetchTicket = require('./wechat/ticket');
const app = express();

// 配置ejs
app.set('views', 'views');
app.set('view engine', 'ejs');

app.get('/search', async (req, res) => {
  /*
    1. 参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分）。
    2. 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。
    3. 这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
  */
  const { ticket } = await fetchTicket();
  const url = 'http://4d4b249f.ngrok.io/search';
  const noncestr = Math.random().toString().slice(2);
  const timestamp = Math.round(Date.now() / 1000);
  
  const arr = [
    `jsapi_ticket=${ticket}`,
    `url=${url}`,
    `noncestr=${noncestr}`,
    `timestamp=${timestamp}`
  ];
  
  const signature = sha1(arr.sort().join('&'));
  
  res.render('search', {noncestr, timestamp, signature});
})

app.use(reply());

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
})