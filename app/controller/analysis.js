
'use strict';

const Controller = require('egg').Controller;

class AnalysisController extends Controller {
  async monthBill() {
    const { ctx, app } = this;
    try {
      // 1、获取查询参数
      const { billDate } = ctx.query;
      console.log('1、获取查询参数',billDate);
      // 2、参数判空
      if (!billDate) {
        ctx.body = {
          status: 400,
          desc: '参数错误',
          data: null
        }
        return;
      }
      // 3、拿到 token 获取用户信息 user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      let user_id = decode.id;
      console.log('2、拿到 token 获取用户信息 user_id',user_id);
      // 4、获取月度账单统计数据
      const monthBillResult = await ctx.service.analysis.monthBill(user_id, billDate);
      const monthBillList = JSON.parse(JSON.stringify(monthBillResult));
      console.log('3、获取月度账单统计数据',monthBillResult,monthBillList);
      // 累加相同的消费类型 type_id 生成新的数组返回
      let dataList = monthBillList.reduce((curr, next) => {
        const index = curr.findIndex(item => item.type_id == next.type_id)
        if (index == -1) {
          curr.push({
            type_id: next.type_id,
            type_name: next.type_name,
            pay_type: next.pay_type,
            number: Number(next.amount)
          })
        }
        if (index > -1) {
          curr[index].number += Number(next.amount);
        }
        return curr;
      }, []);
      // 当月总支出：支付类型：1：支出，2：收入
      let totalExpense = monthBillList.reduce((curr, next) => {
        if (next.pay_type === 1) {
          curr += Number(next.amount);
          return curr;
        }
        return curr;
      }, 0).toFixed(2); 
      // 当月总收入：支付类型：1：支出，2：收入
      let totalIncome = monthBillList.reduce((curr, next) => {
        if (next.pay_type === 2) {
          curr += Number(next.amount);
          return curr;
        }
        return curr;
      }, 0).toFixed(2);
      console.log('当月总支出：',totalExpense, '当月总收入：',totalIncome);
      ctx.body = {
        status: 200,
        desc: '请求成功',
        data: {
          totalExpense, // 当月总支出
          totalIncome, // 当月总收入
          dataList: dataList, // 列表数据
        }
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

module.exports = AnalysisController;
