import { customerSchema, paymentSchema } from '../db/sql/schemas/index.js'
import { Router } from 'express'
import dbConn from '../db/sql/dbConn.js'
import { avg, eq, sql, count, sum } from 'drizzle-orm'
import { GetSummaryCustomerPayments } from '../db/sql/repository/payments-repo.js'
// import { NotFoundError } from '../middleware/error-types'

const paymentRouter = Router()

class PaymentController {
  static async getPayements(req, res, next) {
    try {
      const payments = dbConn.query.paymentSchema.findMany()
      //   if (!payments) return NotFoundError('no payments')

      return res.status(200).send(payments)
    } catch (err) {
      next(err)
    }
  }

  static async getCutomerTotalPayments(req, res, next) {
    try {
      // const customer
    } catch (error) {
      next(err)
    }
  }

  static async getCustomerPayment(req, res, next) {
    try {
      // const customerPayemnt = await dbConn.query.customerSchema.findMany({
      //   where: eq(customerSchema.customer_id, req.params.userId),
      //   with: {
      //     payments: true,
      //     rentals: true,
      //   },
      // })

      const customerPayemnt = await dbConn
        .select({
          amout: paymentSchema.monto,
          userName: customerSchema.nombre,
          userLastName: customerSchema.apellido,
        })
        .from(customerSchema)
        .where(eq(customerSchema.customer_id, req.params.customerId))
        .innerJoin(
          paymentSchema,
          eq(customerSchema.customer_id, paymentSchema.customer_id)
        )

      const [avgCustomerPayment] = await GetSummaryCustomerPayments(
        req.params.customerId
      )

      return res.json(avgCustomerPayment)
    } catch (error) {
      next(error)
    }
  }
}

paymentRouter.get('/', PaymentController.getPayements)
paymentRouter.get('/customer/:customerId', PaymentController.getCustomerPayment)

export default paymentRouter
