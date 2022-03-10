
'use strict';

const Controller = require('egg').Controller;
const moment = require('moment'); // JavaScript 日期处理类库

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    // 1、获取请求中携带的参数
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    // 2、判空处理
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        status: 400,
        desc: '参数错误',
        data: null
      }
    }

    try {
      // 3、拿到 token 获取用户信息
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      // user_id 默认添加到每个账单项，用于滤出
      let user_id = decode.id
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id
      });
      ctx.body = {
        status: 200,
        desc: '请求成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        desc: '系统错误',
        data: null
      }
    }
  }
  async list() {
    const { ctx, app } = this;
    try {
      /**
       *  curPage, // 当前页数 （默认为1）
       *  pageSize, // 一页多少条（默认为5）
       *  typeId, // 类型 'all'就是全部类型
       *  billDate, // YYYY-MM 账单日期
       * */ 
      // 1、获取查询参数
      const { curPage = 1, pageSize = 5, typeId = 'all', billDate } = ctx.query;
      console.log('1、获取查询参数',curPage,pageSize,typeId,billDate);
      // 2、拿到 token 获取用户信息 user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      let user_id = decode.id;
      console.log('2、拿到 token 获取用户信息 user_id',user_id);
      // 3、通过 user_id 获取列表分页数据
      const dayResult = await ctx.service.bill.list(user_id, typeId, billDate, curPage, pageSize);
      const dayList = JSON.parse(JSON.stringify(dayResult));
      console.log('3、通过 user_id 获取当前用户的账单列表',dayResult,dayList);
      // 4、组装数据：需要通过日获取一天的账单列表数据
      let dataList = [];
      for(var i = 0; i < dayList.length; i++) {
        const day = moment(dayList[i].day).format("YYYY-MM-DD");
        const month = moment(dayList[i].day).format("YYYY-MM");
        if(month === billDate) {
          const listResult = await ctx.service.bill.listByDay(user_id, typeId, billDate, day);
          const billsList = JSON.parse(JSON.stringify(listResult));
          console.log(day,listResult,billsList);
          dataList.push({
            day: day,
            bills: billsList
          });
        }
      }
      console.log('4、然后将 list 过滤出月份和类型所对应的账单列表',dataList);
      // 5、获取当月总支出、当月总收入、总条数
      // 获取一个月的有账单的所有天数列表 typeId 写死为all
      const allDayResult = await ctx.service.bill.allList(user_id, 'all', billDate);
      const allDayList = JSON.parse(JSON.stringify(allDayResult));
      // 当月总支出：支付类型：1：支出，2：收入
      let totalExpense = allDayList.reduce((curr, next) => {
        if (next.pay_type === 1) {
          curr += Number(next.amount);
          return curr;
        }
        return curr;
      }, 0).toFixed(2); 
      // 当月总收入：支付类型：1：支出，2：收入
      let totalIncome = allDayList.reduce((curr, next) => {
        if (next.pay_type === 2) {
          curr += Number(next.amount);
          return curr;
        }
        return curr;
      }, 0).toFixed(2);
      // 总条数 需要根据 typeId 去过滤
      const allDayTypeIdResult = await ctx.service.bill.allList(user_id, typeId, billDate);
      const allDayTypeIdList = JSON.parse(JSON.stringify(allDayTypeIdResult));
      let obj = {}; // 用年月日作为 key（YYYY-MM-DD）
      // 天数去重
      let newAllDayTypeIdList = allDayTypeIdList.reduce((item, next) => {
        let nextDate = moment(next.date).format("YYYY-MM-DD");
        obj[nextDate] ? '' : obj[nextDate] = true && item.push(next);
        return item;
      }, []);
      let totalRow = newAllDayTypeIdList.length;
      console.log('5、获取一个月的有账单的天数列表', obj, newAllDayTypeIdList);
      console.log('总条数', totalRow, '当月总支出：',totalExpense, '当月总收入：',totalIncome);
      ctx.body = {
        status: 200,
        desc: '请求成功',
        data: {
          totalExpense, // 当月总支出
          totalIncome, // 当月总收入
          dataList: dataList, // 列表数据
          pageObj: {
            curPage, // 当前页数
            pageSize, // 一页多少条
            totalPage: Math.ceil(totalRow / pageSize), // 总分页数
            totalRow, // 总条数
          }
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

module.exports = BillController;
