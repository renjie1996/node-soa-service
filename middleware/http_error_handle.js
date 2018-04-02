const HttpBaseError = require("../error/httpBaseError/http_base_error")
const logger = require('../utils/loggers/logger')

function handle (options) {
  return function (err, req, res, next) {
    if(err instanceof HttpBaseError) {
      const errMeta = {
        query: req.query,
        url: req.originalUrl,
        userInfo: req.user
      }
      // console.log(`${err.httpStatusCode} ${err.msg} ${err.errCode}`, err)
      logger.error(err.message, errMeta)
      res.statusCode = err.httpStatusCode
      res.json({
        code: err.errCode,
        msg: err.httpMsg
      })
    } else {
      next(err)
    }
    
  }
}

module.exports = handle