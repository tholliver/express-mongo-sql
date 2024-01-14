import { Router } from 'express'
import {
  getTotalRentsByDate,
  getTotalPaysByDate,
  getTotalCustomers,
  unitsOnInventory,
} from '../db/sql/repository/stats-repo.js'

const statsRouter = Router()

class Stats {
  static generalStats = async (req, res, next) => {
    const { startdate } = req.query
    try {
      const [rents] = await getTotalRentsByDate(startdate)
      const [totalMade] = await getTotalPaysByDate(startdate)
      const [totalCustomers] = await getTotalCustomers(startdate)
      const [unitsInventory] = await unitsOnInventory()
      return res.status(200).send({
        rents: rents.totalRents,
        totalMade: totalMade.sum,
        units: unitsInventory.units,
        customers: totalCustomers.totalCustomers,
      })
    } catch (error) {
      next(error)
    }
  }
}

statsRouter.get('/', Stats.generalStats)

export default statsRouter
