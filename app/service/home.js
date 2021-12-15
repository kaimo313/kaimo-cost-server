'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    const { ctx, app } = this;
    // 获取 id 的 sql 语句
    const QUERY_STR = 'id, name';
    let sql = `select ${QUERY_STR} from list`;
    try {
      // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
      const result = await app.mysql.query(sql); 
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async add_user(name) {
    const { ctx, app } = this;
    try {
      // 给 list 表，新增一条数据
      const result = await app.mysql.insert('list', { name });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async update_user(id, name) {
    const { ctx, app } = this;
    try {
      // 给 list 表，更新一条数据
      const result = await app.mysql.update('list', {name}, {
        where: { id }
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async delete_user(id) {
    const { ctx, app } = this;
    try {
      // 给 list 表，删除一条数据
      const result = await app.mysql.delete('list', {id});
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = HomeService;