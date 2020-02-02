'use strict';

module.exports = options => {
  return async function adminauth(ctx, next) {
    console.log('adminauth');
    await next();
  };
};
