'use strict';

const Service = require('egg').Service;

class AnalysisService extends Service {
  // 获取月份所有账单数据
  async monthBill(user_id, month) {
    const { app } = this;
    try {
      let sql = "select * from `kaimo-cost`.bill b where user_id = "+ user_id + " and DATE_FORMAT(b.date,'%Y-%m') = '" + month + "'";
      console.log('获取月份所有账单数据', sql);
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = AnalysisService;