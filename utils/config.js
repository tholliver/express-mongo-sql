import 'dotenv/config'

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI
// const PG_URI = process.env.PG_URI
const PG_URI = process.env.PG_PRO_URI

export { PORT, MONGO_URI, PG_URI }
