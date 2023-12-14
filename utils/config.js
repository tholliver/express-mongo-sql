import 'dotenv/config'

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const PG_URI = process.env.PG_URI

export { PORT, MONGO_URI, PG_URI }
