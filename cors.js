import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080/',
  'http://localhost:3001/',
  'http://localhost:3000',
  'https://dvdrental-site.vercel.app',
]
export const corsMiddleware = ({ aceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (aceptedOrigins.includes(origin)) return callback(null, true)

      if (!origin) return callback(null, true)
      return callback(new Error('Not allowed by cors'))
    },
  })
