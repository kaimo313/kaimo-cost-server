'use strict';
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mkdirp = require('mkdirp');
const uuidv1 = require('uuid/v1');

const Controller = require('egg').Controller;

class UploadController extends Controller {
  async uploadAvatar () {
    const { ctx, config } = this;
    try {
      // 0、获取文件
      let file = ctx.request.files[0];
      console.log('获取文件', file);
      // ctx.request.files[0] 表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
      let fileData = fs.readFileSync(file.filepath);
      // 1、获取当前日期
      let day = moment(new Date()).format('YYYYMMDD');
      console.log('1、获取当前日期', day);
      // 2、创建图片保存的路径
      let dir = path.join(config.uploadAvatarDir, day);
      console.log('2、创建图片保存的路径', dir);
      // 3、创建目录
      await mkdirp.sync(dir);
      // 4、生成路径返回
      let temp_uuid = uuidv1(); // uuid
      let file_name = day + "_" + temp_uuid + path.extname(file.filename); // 图片文件名称
      let tempDir = path.join(dir, file_name); // 返回图片保存的路径
      console.log('返回图片保存的路径', tempDir);
      // 5、写入文件夹
      fs.writeFileSync(tempDir, fileData);
      ctx.body = {
        status: 200,
        desc: '上传成功',
        data: file_name,
      }
    } catch(error) {
      ctx.body = {
        status: 500,
        desc: '上传失败',
        data: null
      }
    } finally {
      // 6、清除临时文件
      ctx.cleanupRequestFiles();
    }
  }
  async getAvatar () {
    const { ctx, config } = this;
    try {
      // 0、获取图片名称
      let picname = ctx.query.picname;
      console.log('0、获取图片名称', picname);
      // 1、判断
      if(!picname) {
        ctx.body = {
          status: 400,
          desc: 'picname 参数必传',
          data: null
        }
        return;
      }
      // 拼接图片保存的路径
      let dir = path.join(config.uploadAvatarDir, [picname.split("_")[0], picname].join("/"));
      console.log('1、拼接图片保存的路径', dir);
      // 前缀
      let prefix = "data:" + path.extname(picname).slice(1) + ";base64,"
      // 读取文件 转成 base64
      let base64 = fs.readFileSync(dir, 'base64');
      console.log(prefix);
      ctx.body = {
        status: 200,
        desc: '获取成功',
        data: prefix + base64
      };
    } catch(error) {
      ctx.body = {
        status: 500,
        desc: '获取失败',
        data: null
      };
    }
  }
}

module.exports = UploadController;