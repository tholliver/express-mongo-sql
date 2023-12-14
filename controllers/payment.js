import { customerSchema, paymentSchema } from '../db/sql/schemas/index.js'
import { Router } from 'express'
import dbConn from '../db/sql/dbConn.js'
import { avg, eq, sql, count, sum } from 'drizzle-orm'
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
        .select({ amout: paymentSchema.monto })
        .from(customerSchema)
        .where(eq(customerSchema.customer_id, req.params.userId))
        .innerJoin(
          paymentSchema,
          eq(customerSchema.customer_id, paymentSchema.customer_id)
        )

      const [avgCustomerPayment] = await dbConn
        .select({
          customerId: customerSchema.customer_id,
          averagePayment:
            sql`round(cast(avg(${paymentSchema.monto}) as numeric), 2)`.mapWith(
              Number
            ),
          count: count(customerSchema.customer_id),
          sum: sql`round(cast(sum(${paymentSchema.monto}) as numeric), 2)`.mapWith(
            Number
          ),
        })
        .from(customerSchema)
        .where(eq(customerSchema.customer_id, req.params.userId))
        .innerJoin(
          paymentSchema,
          eq(customerSchema.customer_id, paymentSchema.customer_id)
        )
        .groupBy(customerSchema.customer_id)
        .limit(1)

      return res.json(avgCustomerPayment)
    } catch (error) {
      next(error)
    }
  }
}

paymentRouter.get('/', PaymentController.getPayements)
paymentRouter.get('/customer/:userId', PaymentController.getCustomerPayment)

export default paymentRouter
