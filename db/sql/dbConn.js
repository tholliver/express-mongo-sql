import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { PG_URI } from '../../config/index.js'
import * as schema from './schemas/index.js'

// for query purposes
const queryClient = postgres(PG_URI)
const dbConn = drizzle(queryClient, { schema })

export default dbConn
