import dbConn from '../dbConn.js'
import { eq, sum, count, avg, sql } from 'drizzle-orm'
import {
  customerSchema,
  inventorySchema,
  paymentSchema,
  rentalSchema,
  filmSchema,
} from '../schemas/index.js'

export const GetCustomerPayemnts = async () => {
  return await dbConn
    .select({
      amout: paymentSchema.monto,
      userName: customerSchema.nombre,
      userLastName: customerSchema.apellido,
    })
    .from(customerSchema)
    .where(eq(customerSchema.customer_id, req.params.userId))
    .innerJoin(
      paymentSchema,
      eq(customerSchema.customer_id, paymentSchema.customer_id)
    )
}

export const GetCustomerRentals = async (customerId) => {
  return await dbConn
    .select({
      filmName: filmSchema.titulo,
      rentalDate: rentalSchema.fecha_de_renta,
      returnDate: rentalSchema.fecha_de_retorno,
      amountPaid: sql`${paymentSchema.monto}`.mapWith(Number),
    })
    .from(filmSchema)
    .where(eq(rentalSchema.customer_id, customerId))
    .innerJoin(inventorySchema, eq(filmSchema.film_id, inventorySchema.film_id))
    .innerJoin(
      rentalSchema,
      eq(inventorySchema.inventory_id, rentalSchema.inventory_id)
    )
    .innerJoin(
      paymentSchema,
      eq(paymentSchema.rental_id, rentalSchema.rental_id)
    )
  // .groupBy(
  //   filmSchema.titulo,
  //   rentalSchema.fecha_de_renta,
  //   rentalSchema.fecha_de_retorno
  // )
}

export const GetSummaryCustomerPayments = async (customerId) => {
  return await dbConn
    .select({
      userName: customerSchema.nombre,
      userLastName: customerSchema.apellido,
      averagePayment:
        sql`round(cast(avg(${paymentSchema.monto}) as numeric), 2)`.mapWith(
          Number
        ),
      count: count(customerSchema.customer_id),
      totalSpend:
        sql`round(cast(sum(${paymentSchema.monto}) as numeric), 2)`.mapWith(
          Number
        ),
    })
    .from(customerSchema)
    .where(eq(customerSchema.customer_id, customerId))
    .leftJoin(
      rentalSchema,
      eq(rentalSchema.customer_id, customerSchema.customer_id)
    )
    .rightJoin(
      paymentSchema,
      eq(rentalSchema.rental_id, paymentSchema.rental_id)
    )
    .groupBy(customerSchema.nombre, customerSchema.apellido)
    .limit(1)
}
