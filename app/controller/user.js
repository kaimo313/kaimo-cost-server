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
      // 3、生成 token 
      const token = app.jwt.sign({
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // token 有效期为 24 小时
      }, app.config.jwt.secret);
      // 返回 token
      ctx.body = {
        status: 200,
        desc: '登录成功',
        data: { token }
      };
    } catch (error) {
      ctx.body = {
        status: 500,
        desc: '登录失败',
        data: null
      }
    }
  }
  // 测试 解析 token
  async getTokenInfo() {
    const { ctx, app } = this;
    // 1. 获取请求头 authorization 属性，值为 token
    const token = ctx.request.header.authorization;
    // 2. 用 app.jwt.verify(token， app.config.jwt.secret)，解析出 token 的值
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    console.log('测试 解析 token', decode);
    // 返回 token
    ctx.body = {
      status: 200,
      desc: '获取成功',
      data: { ...decode }
    };
  }
  // 获取用户信息
  async getUserInfo() {
    try {
      const { ctx, app } = this;
      // 1. 获取请求头 authorization 属性，值为 token
      const token = ctx.request.header.authorization;
      // 2. 用 app.jwt.verify(token， app.config.jwt.secret)，解析出 token 的值
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      // 3、根据用户名，在数据库查找相对应的id操作
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      // 返回 token
      ctx.body = {
        status: 200,
        desc: '获取成功',
        data: {
          id: userInfo.id,
          username: userInfo.username,
          signature: userInfo.signature,
          avatar: userInfo.avatar,
        }
      };
    } catch (error) {
      ctx.body = {
        status: 500,
        desc: '获取失败',
        data: null
      }
    }
  }
}

module.exports = UserController;
