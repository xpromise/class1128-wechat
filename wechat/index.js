/*
  实现微信公众号提供的各个接口
 */
const rp = require('request-promise-native');
const fetchAccessToken = require('./access-token');

const URL_PREFIX = 'https://api.weixin.qq.com/cgi-bin/';

// 菜单配置项
const menu = {
  "button":[
    {
      "type":"click",  // 单击菜单
      "name":"首页☀",
      "key":"home"
    },
    {
      "name":"菜单🙏",
      "sub_button":[
        {
          "type":"view",  // 跳转到指定网址
          "name":"官网",
          "url":"http://www.atguigu.com/"
        },
        {
          "type": "scancode_waitmsg",
          "name": "扫码带提示",
          "key": "扫码带提示"
        },
        {
          "type": "scancode_push",
          "name": "扫码推事件",
          "key": "扫码推事件"
        },
        {
          "type": "pic_sysphoto",
          "name": "系统拍照发图",
          "key": "rselfmenu_1_0"
        },
        {
          "type": "pic_photo_or_album",
          "name": "拍照或者相册发图",
          "key": "rselfmenu_1_1"
        },
      ]
    },
    {
      "name":"菜单二💋",
      "sub_button":[
        {
          "type": "pic_weixin",
          "name": "微信相册发图",
          "key": "rselfmenu_1_2"
        },
        {
          "name": "发送位置",
          "type": "location_select",
          "key": "rselfmenu_2_0"
        }
      ]
    },
  ]
}

// 微信创建新菜单之前，必须将旧菜单删除掉
async function createMenu() {
  // 获取access_token
  const { access_token } = await fetchAccessToken();
  // 定义请求地址
  const url = `${URL_PREFIX}menu/create?access_token=${access_token}`;
  // 发送请求
  const result = await rp({method: 'POST', url, json: true, body: menu});
  
  return result;
}

async function deleteMenu() {
  // 获取access_token
  const { access_token } = await fetchAccessToken();
  // 定义请求地址
  const url = `${URL_PREFIX}menu/delete?access_token=${access_token}`;
  // 发送请求
  const result = await rp({method: 'GET', url, json: true});
  
  return result;
}

/**
 * 创建标签
 * @param name 标签名
 * @return {Promise<*>}
 */
async function createTag(name) {
  // 获取access_token
  const { access_token } = await fetchAccessToken();
  // 定义请求
  const url = `${URL_PREFIX}tags/create?access_token=${access_token}`;
  // 发送请求
  return await rp({method: 'POST', url, json: true, body: {tag: {name}}});
}

/**
 * 获取标签下的所有粉丝列表
 * @param tagid  标签id
 * @param next_openid  从哪个用户开始拉取
 * @return {Promise<*>}
 */
async function getTagUsers(tagid, next_openid = '') {
  // 获取access_token
  const { access_token } = await fetchAccessToken();
  // 定义请求
  const url = `${URL_PREFIX}user/tag/get?access_token=${access_token}`;
  // 发送请求
  return await rp({method: 'POST', url, json: true, body: {tagid, next_openid}});
}

/**
 * 批量为多个用户打标签
 * @param openid_list 用户列表
 * @param tagid 标签id
 * @return {Promise<*>}
 */
async function batchUsersTag(openid_list, tagid) {
  // 获取access_token
  const { access_token } = await fetchAccessToken();
  // 定义请求
  const url = `${URL_PREFIX}tags/members/batchtagging?access_token=${access_token}`;
  // 发送请求
  return await rp({method: 'POST', url, json: true, body: {openid_list, tagid}});
}

/**
 * 根据标签进行群发消息
 * @param body 参数文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1481187827_i0l21
 * @return {Promise<*>}
 */
async function sendMessage(body) {
  // 获取access_token
  const { access_token } = await fetchAccessToken();
  // 定义请求
  const url = `${URL_PREFIX}message/mass/sendall?access_token=${access_token}`;
  // 发送请求
  return await rp({method: 'POST', url, json: true, body});
}

(async () => {
  /*let result1 = await createTag('class1128');
  console.log(result1);
  let result2 = await batchUsersTag([
    'oAsoR1iP-_D3LZIwNCnK8BFotmJc',
  ], result1.tag.id); // 139
  console.log(result2);
  let result3 = await getTagUsers(result1.tag.id);
  console.log(result3);*/
  
  const body = {
    "filter":{
      "is_to_all":false,  // 是否添加进历史记录
      "tag_id": 139
    },
    "text":{
      "content": '测试群发消息~ \n点击提前学习后面的课程 \n<a href="https://segmentfault.com/a/1190000018534625">webpack4开发教程</a>'
    },
    "msgtype":"text"
  }
  const result = await sendMessage(body);
  console.log(result);
})()