const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const JWT = require('jsonwebtoken')
const pdkdf2Async = require('bluebird').promisify(crypto.pbkdf2)
const users = [];
const usersRouter = require('./users');
const adminRouter = require('./admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/user', usersRouter);

router.use('/admin', adminRouter);

/* 登录 */
router.get('/simplelogin', (req, res, next) => {
  const { username } = req.query
  if(!users.find(u => u.username === username)) {
    res.set('Set-Cookie', `username=${req.query.username}`)
    users.push({
      username
    })
  }
  res.send();
})

router.get('/hello', (req, res, next) => {
  const { username } = req.query
  if(users.find(u => u.username === username)) {
    res.send(`<h1>hello, ${req.cookies.username}</h1>`)
  } else {
    res.send('no login during this time server is up')
  }
})

router.get('/session', (req, res, next) => {
  // 默认使用base64进行转码，new Buffer().toString()可以还原
  const { username } = req.query
  req.session.user = { username }
  res.send()
})

router.get('/goodmorning', (req, res, next) => {
  const { username } = req.session.user
  console.log(username)
  res.send(`<h1>hello, ${username}</h1>`)
})

// json-my-token JWT
// 三部分组成
// 无状态，分布式服务很友好，服务器重启用户需要登录
// 1. 集群数据库，session统一管理，有问题：集群的时候，副本级，很大的话，数据冗余 =》 
// 需要用分片的形式，请求用户请求的id，散列化处理,均匀分散，比如算一个base64根据它最后几位余一个大小出来，
// 分配到对应的机器上，稳定性较差

// 2. 换种方式，存在cookie、token中，这样更加好，不好之处在于：明文的，对这个用户的控制权很高，
// 对安全要求较高，使用交叉验证的形式（手机、邮箱、过期时间更短的）

router.get('/jwtlogin', (req, res, next) => {
  const { username } = req.query
  const user = { username }
  const token = JWT.sign(user, 'kahsfjkbaskfjb342')
  res.send(token)
})

router.get('/goodafternoon', (req, res, next) => {
  const auth = req.get('Authorization')
  if(!auth || !auth.indexOf('Bearer ') === -1) return res.send('no Auth')
  const token = auth.split('Bearer ')[1]
  // console.log(token)
  const user = JWT.verify(token, 'kahsfjkbaskfjb342')
  // const { username } =user
  res.send(user)
})

// 使用交叉验证的形式（手机、邮箱、过期时间更短的）
// 时间较短的token （交叉认证）
router.get('/shortlogin', (req, res, next) => {
  const { username } = req.query
  const user = { username , expireAt: Date.now().valueOf() + (15 * 1000)}
  const token = JWT.sign(user, 'kahsfjkbaskfjb342')
  res.send(token)
})

router.get('/good16am', (req, res, next) => {
  const auth = req.get('Authorization')
  if(!auth || !auth.indexOf('Bearer ') === -1) return res.send('no Auth')
  const token = auth.split('Bearer ')[1]
  // console.log(token)
  const user = JWT.verify(token, 'kahsfjkbaskfjb342')
  if(user.expireAt < Date.now().valueOf()) res.send('auth expired! you should regain auth')
  // const { username } =user
  res.send(user)
})


// 密码的问题
// sync方法基本只能用于测试，主线程所有进程都会被阻塞
// 这个方法比较耗时，需要用异步的方法
// 还有一个问题是密码最好和其他信息分库存储，还需要auth2鉴权中心，再验证

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  const cipher = await pdkdf2Async(password, 'fasfasfasffasf', 1000, 512, 'sha256')
  res.end(cipher)
})


module.exports = router;


