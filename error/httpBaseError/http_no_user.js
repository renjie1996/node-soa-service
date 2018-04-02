const HttpBaseError = require("./http_base_error")

class NoSuchUserError extends HttpBaseError {
  constructor(id, username) {
    super(404, '该用户不存在', 3000001, `no such user: ${username}, ${id}`)
  }
}

module.exports = NoSuchUserError