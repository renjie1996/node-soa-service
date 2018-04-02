const HttpBaseError = require('./http_base_error')

const ERROR_CODE = 5000000

class HttpInternalError extends HttpBaseError {
  constructor(msg) {
    super(500, '服务器正在开小差，请联系程序员小哥哥', ERROR_CODE, `something wrong: ${msg}` )
  }
}

module.exports = HttpInternalError