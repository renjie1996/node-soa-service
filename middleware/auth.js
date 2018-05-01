const UserService  = require('../services/user')
const NoAuthError = require('../error/httpBaseError/http_noAuth')
const JWT = require('jsonwebtoken')
const JWT_CONFIG = require('../cipher/JWT_config')

module.exports = options => async (req, res, next) => {
  try {
    const authorization = req.get('Authorization')
    if(!authorization || authorization.indexOf('Bearer ') === -1) {
      throw new NoAuthError(null)
    }

    const token = authorization.split(' ')[1]

    if(! token) {
      throw new NoAuthError(null)
    }

    // 认证信息
    try {
      const user = JWT.verify(token, JWT_CONFIG.SECRET)   
      console.log(user)
      req.user = user
      next()   
    } catch(e) {
      throw new NoAuthError(token)
    }
  } catch (e) {
    next(e)
  }
}