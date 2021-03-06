/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1639205546588_1305';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadAvatarDir: 'D://kaimo-cost-images/images/avatar', // 上传头像路径
  };
  // 文件读取配置
  config.multipart = {
    mode: 'file'
  };

  // jwt 配置
  config.jwt = {
    secret: 'kaimo313', // 自定义加密字符串，secret 是在服务端的，不要泄露
  };

  // 视图配置
  config.view = {
    mapping: {'.html': 'ejs'}  // 左边写成.html后缀，会自动渲染.html文件
  };

  // 安全配置
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: [ '*' ], // 配置白名单
  };

  // 数据库配置
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'kaimo313', // 初始化密码，没设置的可以不写
      // 数据库名
      database: 'kaimo-cost', // 新建的数据库名称
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  return {
    ...config,
    ...userConfig,
  };
};
