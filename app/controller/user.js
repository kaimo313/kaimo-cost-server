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
  // 登录
  async login() {
    try {
      const { ctx, app } = this;
      // 获取登录时的 username, password
      const { username, password } = ctx.request.body;
      // 根据用户名，在数据库查找相对应的id操作
      const userInfo = await ctx.service.user.getUserByName(username);
      // 1、没找到说明没有该用户
      if (!userInfo || !userInfo.id) {
        ctx.body = {
          status: 500,
          desc: '账号不存在',
          data: null
        }
        return
      }
      // 2、找到用户，并且判断输入密码与数据库中用户密码
      if (userInfo && password != userInfo.password) {
        ctx.body = {
          status: 500,
          desc: '账号密码错误',
          data: null
        }
        return
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        desc: '登录失败',
        data: null
      }
    }
  }
}

module.exports = UserController;