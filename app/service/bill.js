'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async add(params) {
    const { app } = this;
    try {
      // 往 bill 表中，插入一条账单数据
      const result = await app.mysql.insert('bill', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 获取一个月的列表分页数据
  async list(user_id, type_id, month, curPage, pageSize) {
    const { app } = this;
    try {
      // 去重找到日的数据列表降序分页
      let type_id_str = type_id === "all" || type_id === "" ? "" : " and type_id = " + type_id;
      let date_str = " and DATE_FORMAT(b.date,'%Y-%m') = '" + month + "'";
      let sql = "select distinct STR_TO_DATE(b.date,'%Y-%m-%d') day from `kaimo-cost`.bill b where user_id = "+ user_id+ type_id_str + date_str + " order by day desc limit "+(curPage-1)*pageSize+", "+pageSize;
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 通过日获取列表数据
  async listByDay(user_id, type_id, month, day) {
    const { app } = this;
    try {
      const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
      let type_id_str = type_id === "all" || type_id === "" ? "" : " and type_id = " + type_id;
      let date_str = " and STR_TO_DATE(b.date,'%Y-%m-%d') = '" + day + "'" + " and DATE_FORMAT(b.date,'%Y-%m') = '" + month + "'";
      let sql = "select " + QUERY_STR + " from `kaimo-cost`.bill b where user_id = " + user_id + date_str + type_id_str;
      console.log('通过日获取列表数据', sql);
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 获取月的所有账单数据
  async allList(user_id, type_id, month) {
    const { app } = this;
    try {
      let type_id_str = type_id === "all" || type_id === "" ? "" : " and type_id = " + type_id;
      let sql = "select * from `kaimo-cost`.bill b where user_id = "+ user_id + " and DATE_FORMAT(b.date,'%Y-%m') = '" + month + "'" + type_id_str;
      console.log('获取月的所有账单数据', sql);
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = BillService;