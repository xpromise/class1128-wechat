# 微信公众号开发
## 1、验证服务器有效性
* 填写服务器配置信息
  * url  开发者服务器地址
    * 通过ngrok工具将本地地址转化外网能访问的地址（内网穿透）
    * 指令： ngrok http 3000
  * token 参与微信加密签名的参数
* 验证服务器消息有效性
  * 将token、timestamp、nonce三个参数进行字典序排序
    * 因为要排序，最好组合成数组： [token、timestamp、nonce]
    * token来自于页面填写的  timestamp、nonce来自于微信发送过来的查询字符串
    * 字典序排序是按照0-9a-z的顺序进行排序，对应的是数组的sort方法
  * 将三个参数字符串拼接成一个字符串进行sha1加密
    * 数组的join方法就是用来拼串
  * 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    * 成功微信服务器要求返回echostr 
    * 失败说明消息不是微信服务器，返回error

## 2、自动回复
* 接受用户发送的消息
  * 微信会发送两种类型消息：GET请求和POST请求
  * GET请求用来验证服务器有效性
  * POST请求用来接受用户发送的消息
    * POST请求会携带两种参数：querystring参数 和 body参数
    * 其中body参数需要用特殊方式接受
* 判断消息是否来自于微信服务器
* 接受用户发送的xml数据：req.on('data', data => {})
* 将xml数据解析为js对象：xml2js
* 将js对象格式化成为一个更好操作的对象
  * 去掉xml
  * 去掉值的[]
* 最后根据用户消息内容，返回特定的响应
  * 响应数据必须是xml格式，具体参照官方文档  
  * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140543

## 3、模块化项目
* 目的：
  * 模块功能单一化
  * 方便今后维护、扩展、更加健壮
* 将微信加密签名算法方法合并
* 提取了接受用户消息的三个方法，封装成工具函数
  * 封装用来获取用户发送的消息的工具函数
  * 封装将xml数据解析为js对象的工具函数
  * 封装格式化js对象的方法的工具函数
* 封装中间件函数模块，采用的
  * app.use(reply())
  * reply() 方法 返回值是一个中间件函数 --> 更有利于扩展函数的功能
  * 将相关模块依赖放进来并且修改好模块路径
* promise对象用法：要提取异步函数的数据，使用promise对象  
* await用法：要提取promise对象的数据
* async用法：只要用了await，才在当前函数加上async

## 4、封装回复6种消息模板文件
* 回复6种类型，根据type来判断
* 里面尽可能少写重复代码，用字符串拼串的方式实现。
  * 重复的字符串提取出来，不同的单独拼接
  
## 5、完成回复完整用户消息
* 封装处理用户发送的消息，定义响应的数据的模块
* 通过判断不同的消息类型 MsgType 返回不同的响应内容
* 具体类型看文档：
  * 接受普通消息 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140453
  * 接受事件消息 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140454 

## 6、获取access_token
* 接口
  * 简单来讲：就是一个url地址  http://localhost:3000/login
  * 完整包含：
    * 请求方式
    * 请求参数
    * 请求地址
    * 请求头/cookie
    * 响应信息
    * ....
* 定义获取access_token的模块
  * 封装了getAccessToken函数
    * 定义请求地址：三个参数，其中appID、appsecret填写自己页面的，grant_type=client_credential这个值是固定不变的
    * 发送请求，使用的request request-promise-native
    * 设置过期时间 2小时更新，需要提前5分钟刷新
    * 保存为一个本地文件（只能保存字符串数据，将js对象转换为json字符串）
    * 将获取的access_token数据返回出去
  

