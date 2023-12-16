import dbConn from '../db/sql/dbConn.js'
import { eq, sum, count } from 'drizzle-orm'
import {
  customerSchema,
  filmSchema,
  inventorySchema,
  paymentSchema,
  rentalSchema,
} from '../db/sql/schemas/index.js'

import { Router } from 'express'
import { GetCustomerRentals } from '../db/sql/repository/payments-repo.js'

const rentalRouter = Router()

// .selectDistinct({
//   filmName: filmSchema.titulo,
//   rentalDate: rentalSchema.fecha_de_renta,
//   returnDate: rentalSchema.fecha_de_retorno,
// })
class RentalController {
  static async getCustomerRentals(req, res, next) {
    const customerRentals = await GetCustomerRentals(req.params.customerId)

    res.status(200).json(customerRentals)
  }
}

rentalRouter.get('/:customerId', RentalController.getCustomerRentals)

export default rentalRouter
