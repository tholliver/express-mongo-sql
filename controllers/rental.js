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
import {
  GetCustomerRentals,
  GetTopRentedFilms,
} from '../db/sql/repository/payments-repo.js'

const rentalRouter = Router()

class RentalController {
  static async getCustomerRentals(req, res, next) {
    try {
      const customerRentals = await GetCustomerRentals(req.params.customerId)
      res.status(200).json(customerRentals)
    } catch (error) {
      next(error)
    }
  }

  static async totalRentedFilms(req, res, next) {
    try {
      const topFilms = await GetTopRentedFilms()
      console.log('Run', topFilms.slice(0, 10))
      res.status(200).json(topFilms)
    } catch (error) {
      next(error)
    }
  }
}

rentalRouter.get('/:customerId', RentalController.getCustomerRentals)
rentalRouter.get('/', RentalController.totalRentedFilms)

export default rentalRouter
