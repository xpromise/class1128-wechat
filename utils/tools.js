/*
  工具函数模块
 */
const { parseString } = require('xml2js');

module.exports = {
  /**
   * 用来获取用户发送的消息
   * @param req
   * @return {Promise<any>}
   */
  getUserDataAsync (req) {
    return new Promise((resolve, reject) => {
      let xmlData = '';
      req
        .on('data', (data) => {
          xmlData += data.toString();
        })
        .on('end', () => {
          //说明数据接受完毕
          resolve(xmlData)
        })
    })
  },
  
  /**
   * 将xml数据解析为js对象
   * @param xmlData
   * @return jsData
   */
  parseXMLData (xmlData) {
    let jsData = null;
    parseString(xmlData, {trim: true}, (err, result) => {
      if (!err) {
        jsData = result;
      } else {
        jsData = {};
      }
    })
    return jsData;
  },
  
  /**
   * 格式化js对象的方法
   * @param jsData
   * @return userData
   */
  formatJsData (jsData) {
    const { xml } = jsData;
    const userData = {};
    for (let key in xml) {
      // 获取到属性值
      const value = xml[key];
      // 去掉数组
      userData[key] = value[0];
    }
    return userData;
  }
  
}