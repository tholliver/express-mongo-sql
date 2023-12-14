import cors from 'cors'

const ACCEPTED_ORIGINS = ['http://localhost:3000/', 'http://localhost:8080/']
const corsMiddleware = ({ allowedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) return callback(null, true)
      if (!origin) return callback(null, true)

      return callback(new Error('Origin not allowed by cors'))
    },
  })
}

export default corsMiddleware
