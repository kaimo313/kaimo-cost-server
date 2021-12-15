'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // router.get('/user/:id', controller.home.user);

  // 用户 crud 路由层
  router.get('/user', controller.home.user);
  router.post('/add_user', controller.home.add_user);
  router.post('/update_user', controller.home.update_user);
  router.post('/delete_user', controller.home.delete_user);
};
