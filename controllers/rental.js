import { Router } from 'express'
import {
  GetCustomerRentals,
  GetTopRentedFilms,
} from '../db/sql/repository/payments-repo.js'

import { GetRentsByDateGroup } from '../db/sql/repository/rental-repo.js'

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
      // console.log('Run', topFilms.slice(0, 10))
      res.status(200).json(topFilms)
    } catch (error) {
      next(error)
    }
  }

  static async rentsPerGroupDate(req, res, next) {
    try {
      const { by } = req.query
      console.log('Run', by)

      const totalRents = await GetRentsByDateGroup(by)
      console.log(totalRents)
      res.status(200).json(totalRents)
    } catch (error) {
      next(error)
    }
  }
}

rentalRouter.get('/totals', RentalController.rentsPerGroupDate)
rentalRouter.get('/:customerId', RentalController.getCustomerRentals)
rentalRouter.get('/', RentalController.totalRentedFilms)

export default rentalRouter
