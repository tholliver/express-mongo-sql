import { Router } from 'express'
import { GetCustomerRentals } from '../db/sql/repository/payments-repo.js'
import {
  GetTopRentedFilms,
  GetTopRentedFilmsTimeLapsed,
} from '../db/sql/repository/rental-repo.js'

import { GetRentsByDateGroup } from '../db/sql/repository/rental-repo.js'

const rentalRouter = Router()

class RentalController {
  static async getCustomerRentals(req, res, next) {
    const { customerId } = req.params
    // const { customerId } = parseInt(req.params.customerId, 10)
    console.log(customerId, typeof customerId)

    if (!customerId) {
      return res.status(400).send({ msg: 'No customer param provided' })
    }

    try {
      const customerRentals = await GetCustomerRentals(customerId)
      return res.status(200).json(customerRentals)
    } catch (error) {
      console.log('Something happened:', error)
      return next(error)
    }
  }

  static async totalTopRentedFilms(req, res, next) {
    const { time, lapse } = req.query
    try {
      if (time && lapse) {
        console.log('Here conditioning', time, 'Lapse: ', lapse)
        const topFilmsRented = await GetTopRentedFilmsTimeLapsed(time, lapse)
        return res.status(200).json(topFilmsRented)
      }

      const topFilmsRented = await GetTopRentedFilms()
      return res.status(200).json(topFilmsRented)
    } catch (error) {
      next(error)
    }
  }

  static async rentsPerGroupDate(req, res, next) {
    try {
      const { by } = req.query

      const totalRents = await GetRentsByDateGroup(by)
      res.status(200).json(totalRents)
    } catch (error) {
      next(error)
    }
  }

  static async rentVoidRoute(req, res, next) {
    return res.status(200).json({ msg: 'u are in rentals' })
  }
}
rentalRouter.get('/', RentalController.totalTopRentedFilms)
rentalRouter.get('/totals', RentalController.rentsPerGroupDate)
rentalRouter.get('/:customerId', RentalController.getCustomerRentals)
// rentalRouter.get('/', RentalController.rentVoidRoute)

export default rentalRouter
