'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  // 传入加密字符串
  const verify_token = middleware.verifyToken(app.config.jwt.secret);
  // 注册路由
  router.post('/api/user/register', controller.user.register);
  // 登录路由
  router.post('/api/user/login', controller.user.login);
  // 测试 token 解析
  router.get('/api/user/token', verify_token, controller.user.getTokenInfo);
  // 获取用户信息
  router.get('/api/user/getUserInfo', verify_token, controller.user.getUserInfo);
};
