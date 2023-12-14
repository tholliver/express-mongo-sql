const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}

class BaseError extends Error {
  constructor(name, statusCode, description) {
    super(description)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = name
    this.statusCode = statusCode
    Error.captureStackTrace(this)
  }
}

class APIError extends BaseError {
  constructor(description = 'api error') {
    super('api internal server error', STATUS_CODES.INTERNAL_ERROR, description)
  }
}

class ValidationError extends BaseError {
  constructor(description = 'bad request') {
    super('bad request', STATUS_CODES.BAD_REQUEST, description)
  }
}

class NotFoundError extends BaseError {
  constructor(description = 'not found') {
    super('not found', STATUS_CODES.NOT_FOUND, description)
  }
}

class AuthorizeError extends BaseError {
  constructor(description = 'not authorized') {
    super('access denied', STATUS_CODES.UN_AUTHORIZED, description)
  }
}

export {
  NotFoundError,
  AuthorizeError,
  ValidationError,
  APIError,
  STATUS_CODES,
}
