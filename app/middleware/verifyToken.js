'use strict';

module.exports = (secret) => {
  return async function verifyToken(ctx, next) {
    // 若是没有 token，返回的是 null 字符串
    const token = ctx.request.header.authorization;
    if(token != 'null' && token) {
      // 有 token 需要校验
      try {
        let decode = ctx.app.jwt.verify(token, secret);
        console.log('token 需要校验', decode);
        await next();
      } catch (error) {
        console.log('error', error)
        ctx.status = 200;
        ctx.body = {
          status: 401,
          desc: 'token已过期，请重新登录'
        }
        return null;
      }
    } else {
      // token 不存在
      ctx.status = 200;
      ctx.body = {
        status: 401,
        desc: 'token不存在'
      };
      return null;
    }
  }
};