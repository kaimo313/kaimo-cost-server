'use strict';

const Service = require('egg').Service;

class TypeService extends Service {
  async list() {
    const { app } = this;
    try {
      let sql = "select * from `kaimo-cost`.type";
      console.log(sql)
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = TypeService;