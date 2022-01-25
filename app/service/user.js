'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 通过用户名获取用户信息
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { username });
      return result;
    } catch(error) {
      console.log(error);
      return null;
    }
  }
  // 注册
  async register(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('user', params);
      return result;
    } catch(error) {
      console.log(error);
      return null;
    }
  }
  // 更新用户信息
  async updateUserInfo(params) {
    const { app } = this;
    try {
      // 通过 app.mysql.update 方法更新 user 表, 通过 id 筛选用户
      const result = await app.mysql.update('user', 
        { ...params }, 
        { id: params.id }
      );
      return result;
    } catch(error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = UserService;