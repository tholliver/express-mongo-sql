const { pgTable, serial, text, varchar, drizzle } = require('drizzle-kit')
const Client = require('pg')

const client = new Client({
  connectionString: 'postgres://postgres:massa@127.0.0.1:5433/dvdrental',
})

await client.connect()
export const db = drizzle(client)
