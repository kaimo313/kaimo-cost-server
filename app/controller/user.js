'use strict';

const Controller = require('egg').Controller;
// 默认头像
const defaultAvatar = 'https://profile.csdnimg.cn/A/C/5/1_kaimo313';

class UserController extends Controller {
  async register() {
    try {
      const { ctx } = this;
      // 获取注册时的 username, password
      const { username, password } = ctx.request.body;
      console.log('注册获取参数', username, password)
      // 1、判空操作
      if (!username || !password) {
        ctx.body = {
          status: 500,
          desc: '账号密码不能为空',
          data: null
        }
        return
      }

      // 2、验证数据库内是否已经有该账户名
      const userInfo = await ctx.service.user.getUserByName(username);
      // 判断是否已经存在
      if(userInfo && userInfo.id) {
        ctx.body = {
          status: 500,
          desc: '账户名已被注册，请重新输入',
          data: null
        }
        return
      }

      // 3、调用 service 方法，将数据存入数据库。
      const result = await ctx.service.user.register({
        username,
        password,
        signature: '这个人很懒，没什么留言',
        avatar: defaultAvatar,
        ctime: new Date()
      });
      console.log('数据存入数据库--->', result);
      if (result) {
        ctx.body = {
          status: 200,
          desc: '注册成功',
          data: null
        }
      } else {
        ctx.body = {
          status: 500,
          desc: '注册失败',
          data: null
        }
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        desc: '注册失败',
        data: null
      }
    }
  }
}

module.exports = UserController;
