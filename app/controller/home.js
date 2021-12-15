'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html', {
      title: 'kaimo 玩 egg',
    });
  }
  // 用户 crud 控制层
  async user() {
    const { ctx } = this;
    const userData = await ctx.service.home.user();
    ctx.body = userData;
  }
  async add_user() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      const result = await ctx.service.home.add_user(name);
      ctx.body = {
        status: 200,
        desc: '新增成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        desc: '新增失败',
        data: null
      }
    }
  }
  async update_user() {
    const { ctx } = this;
    const {id, name} = ctx.request.body;
    try {
      const result = await ctx.service.home.update_user(id, name);
      ctx.body = {
        status: 200,
        desc: '更新成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        desc: '更新失败',
        data: null
      }
    }
  }
  async delete_user() {
    const { ctx } = this;
    const {id} = ctx.request.body;
    try {
      const result = await ctx.service.home.delete_user(id);
      ctx.body = {
        status: 200,
        desc: '删除成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        desc: '删除失败',
        data: null
      }
    }
  }
}

module.exports = HomeController;
