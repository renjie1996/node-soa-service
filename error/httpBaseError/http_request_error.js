const HttpBaseError = require('./http_base_error')

const ERROR_CODE = 4000000

class HttpRequestParamError extends HttpBaseError {
  constructor(paramName, desc, msg) {
    super(200, desc, ERROR_CODE, `${paramName} wrong: ${msg}` )
  }
}

module.exports = HttpRequestParamError