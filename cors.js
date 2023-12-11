const cors = require('cors')

ACCEPTED_ORIGINS = []
const corsMiddleware = ({ allowedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) return callback(null, true)
      if (!origin) return callback(null, true)

      return callback(new Error('Origin not allowed by'))
    },
  })
}

module.exports = corsMiddleware
