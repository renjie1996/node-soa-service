const HttpBaseError = require("./http_base_error")
const ERROR_CODE = '4000001'

class NoAuthError extends HttpBaseError {
  constructor (token) {
    super(401, '您没有访问该资源的权限', ERROR_CODE, `no auth, token: ${token}`)
  }
}

module.exports = NoAuthError