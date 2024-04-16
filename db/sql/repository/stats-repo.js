import dbConn from '../dbConn.js'
import { sql, count, and, gt, lt, sum } from 'drizzle-orm'
import {
  customerSchema,
  inventorySchema,
  paymentSchema,
  rentalSchema,
} from '../schemas/index.js'

export async function getTotalRentsByDate(startDate) {
  let currentDate = new Date().toISOString().slice(0, 10)

  return await dbConn
    .select({
      totalRents: count(),
    })
    .from(rentalSchema)
    .where(
      sql`${rentalSchema.last_update}::date BETWEEN ${startDate} AND ${currentDate}`
    )
}

export async function getTotalPaysByDate(startDate) {
  let currentDate = new Date().toISOString().slice(0, 10)

  return await dbConn
    .select({ sum: sql`COALESCE(SUM(${paymentSchema.amount}), 0)` })
    .from(paymentSchema)
    .where(
      sql`${paymentSchema.payment_date}::date BETWEEN ${startDate} AND ${currentDate}`
    )
}

export async function unitsOnInventory(startDate) {
  let currentDate = new Date().toISOString().slice(0, 10)
  return await dbConn.select({ units: count() }).from(inventorySchema)
}

export async function getTotalCustomers() {
  return await dbConn.select({ totalCustomers: count() }).from(customerSchema)
}
