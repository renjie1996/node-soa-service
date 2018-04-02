const User = require('../model/mongoose/user');
const HTTP_REQ_ERROR = require('../error/httpBaseError/http_request_error');
const NoSuchUserError = require('../error/httpBaseError/http_no_user');
const JWT = require('jsonwebtoken');
const JWT_Config = require('../cipher/JWT_config');

module.exports.getAllUsers = async function () {
  const users = await User.list();
  return users;
};

module.exports.addNewUser = async function (user) {
  let { password, username } = user;
  if(!user || !password || !username) throw new HTTP_REQ_ERROR('user', '用户名或密码不能为空', 'empty error');
  user =  await User.creatUserByUsernameAndPassWord(user);
  return user;
};

module.exports.getUserById = async function(userId) {
  const user = await User.getOneById(userId);
  return user;
};

/**
 * 登录方法
 * @param {*} username 
 * @param {*} password 
 */

module.exports.loginWithUsernameAndPass = async function (username, password) {
  if(!password || !username) throw new HTTP_REQ_ERROR('user', '用户名或密码不能为空', 'empty error');
  const found = await User.getUserByUserAndPassWord(username, password);
  if(!found) throw new NoSuchUserError(null, username);
  const token = JWT.sign(
    {
      id: found._id.toString(),
      expireAt: Date.now().valueOf() + JWT_Config.expireAt
    }, JWT_Config.SECRET);
  return {
    token,
    user: found
  };
}; 