const mongoose = require('mongoose');
const crypto = require('crypto');
const pdkdf2Async = require('bluebird').promisify(crypto.pbkdf2);
const password_config = require('../../cipher/password_config');
const HTTP_REQ_ERROR = require('../../error/httpBaseError/http_request_error');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  }
  // age: {
  //   type: Number,
  //   min: 0,
  //   max: 120
  // },
  // firstName: {
  //   type: String,
  //   required: true
  // },
  // lastName: {
    // type: String,
    // required: true
  // }
});

const UserModel = mongoose.model('user', UserSchema);

// 包装方法
async function insert(user) {
  console.log(user);
  const _user = await UserModel.create(user);
  console.log(_user);
  return _user; 
};

async function getOneById(id) {
  console.log(id);
  const user = await UserModel.findOne({_id: id});
  return user;
};

async function getOneByName(firstName, lastName) {
  const user = await UserModel.findOne({firstName, lastName});
  return user;
};

async function list(params) {
  const match = {};
  const flow = UserModel.find(match);
  const users = await flow.exec();
  return users;
};

async function creatUserByUsernameAndPassWord(user) {
  const { SALT, ITERATIONS, KEY_LENGTH, DIGEST } = password_config;
  const { username } = user;

  // 已有用户名校验
  const usernameDupUser = await UserModel.findOne({username}, {_id: 1});
  if(usernameDupUser) throw new HTTP_REQ_ERROR('username', `这个用户名已经被占用，请重新输入', 'duplicate username: ${username}`);
  // 密码加密传输  
  const passToSave = await pdkdf2Async(user.password, SALT, ITERATIONS, KEY_LENGTH, DIGEST);
  const created = await insert({
    username: user.username,
    password: passToSave
  }, {
    password: 0
  });
  return created;
};

async function getUserByUserAndPassWord(username, password) {
  const { SALT, ITERATIONS, KEY_LENGTH, DIGEST } = password_config;
  const passToFind = await pdkdf2Async(password, SALT, ITERATIONS, KEY_LENGTH, DIGEST);
  const found = await UserModel.findOne({
    username,
    password: passToFind
  }, {
    password: 0
  });
  console.log(found);
  return found;
};

module.exports = {
  insert,
  getOneById,
  getOneByName,
  list,
  creatUserByUsernameAndPassWord,
  getUserByUserAndPassWord
};