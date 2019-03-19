const express = require('express');
const app = express();

app.get('/', (req, res) => {
  
})

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功了~');
  else console.log(err);
})