import dbConn from '../db/sql/dbConn.js'
import { eq } from 'drizzle-orm'
import {
  customerSchema,
  filmSchema,
  inventorySchema,
  paymentSchema,
  rentalSchema,
} from '../db/sql/schemas/index.js'

import { Router } from 'express'

const rentalRouter = Router()

class RentalController {
  static async getCustomerRentals(req, res, next) {
    const customerRentals = await dbConn
      .select({
        filmName: filmSchema.titulo,
        rentalDate: rentalSchema.fecha_de_renta,
        returnDate: rentalSchema.fecha_de_retorno,
        amountPaid: paymentSchema.monto,
        customerId: customerSchema.customer_id,
      })
      .from(customerSchema)
      .where(eq(customerSchema.customer_id, req.params.userId))
      .innerJoin(
        rentalSchema,
        eq(customerSchema.customer_id, rentalSchema.customer_id)
      )
      .innerJoin(
        paymentSchema,
        eq(customerSchema.customer_id, paymentSchema.customer_id)
      )
      .innerJoin(
        inventorySchema,
        eq(inventorySchema.inventory_id, rentalSchema.inventory_id)
      )
      .innerJoin(filmSchema, eq(filmSchema.film_id, inventorySchema.film_id))

    res.json(customerRentals)
  }
}

rentalRouter.get('/:userId', RentalController.getCustomerRentals)

export default rentalRouter
