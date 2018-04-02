const HttpBaseError = require('./http_base_error')

const ERROR_CODE = 4040000

class Http404Error extends HttpBaseError {
  constructor(resourceName, resourceId, httpMsg) {
    super(404, httpMsg, ERROR_CODE, `${resourceName} Not Found id: ${resourceId}` )
  }
}

module.exports = Http404Error