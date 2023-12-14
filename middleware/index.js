const requestLogger = (request, response, next) => {
  console.info('Method:', request.method)
  console.info('Path:  ', request.path)
  console.info('Body:  ', request.body)
  console.info('---')
  next()
}

const ErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500
  const data = error.data || error.message
  return res.status(statusCode).json(data)
}

export { requestLogger, ErrorHandler }
