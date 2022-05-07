
'use strict';

const Controller = require('egg').Controller;

class TypeController extends Controller {
  async list() {
    const { ctx, app } = this;
    try {
      // 1、拿到 token 获取用户信息 user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      // 3、通过 user_id 获取列表分页数据
      const dayResult = await ctx.service.type.list();
      const dayList = JSON.parse(JSON.stringify(dayResult));
      console.log('3、获取当前用户的类型列表', dayList);
      ctx.body = {
        status: 200,
        desc: '请求成功',
        data: dayList
      }
    } catch (error) {
      console.log(error);
      ctx.body = {
        status: 500,
        desc: '系统错误',
        data: null
      }
    }
  }
}

module.exports = TypeController;
