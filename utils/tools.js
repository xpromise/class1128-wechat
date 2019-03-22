/*
  工具函数模块
 */
const { parseString } = require('xml2js');
const { writeFile, readFile } = require('fs');
const { resolve } = require('path');

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
  },
  
  /**
   * 写入文件方法
   * @param filePath 文件路径
   * @param data 要写入的文件内容
   * @return {Promise<any>}
   */
  writeFileAsync (filePath, data) {
    filePath = resolve(__dirname, '../wechat', filePath);
    return new Promise((resolve, reject) => {
      writeFile(filePath, JSON.stringify(data), (err) => {
        if (!err) resolve();
        else reject(err);
      })
    })
  },
  /**
   * 读取文件方法
   * @param filePath 文件路径
   * @return {Promise<any>}
   */
  readFileAsync (filePath) {
    filePath = resolve(__dirname, '../wechat', filePath);
    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        if (!err) {
          // 说明有文件
          resolve(JSON.parse(data.toString()));
        } else {
          // 说明没有文件
          reject(err);
        }
      })
    })
  }
  
}