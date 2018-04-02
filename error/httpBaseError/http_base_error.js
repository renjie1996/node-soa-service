class HttpBaseError extends Error {
  constructor (httpStatusCode, httpMsg, errCode, msg) {
    super(`HTTP ERROR: ${msg}`)
    this.httpStatusCode = httpStatusCode
    this.httpMsg = httpMsg
    this.errCode = errCode
    this.msg = msg
  }
}

module.exports = HttpBaseError



// try {
//   throw new HttpBaseError(404, '资源不存在', 9999, 'resourse not found')
// } catch(e) {
//   console.log(e.message)
//   console.log(e.httpStatusCode)
//   console.log(e.httpMsg)
//   console.log(e.errCode)
// }