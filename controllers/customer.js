import { Router } from 'express'
import { customerSchema } from '../db/sql/schemas/index.js'
import dbConn from '../db/sql/dbConn.js'
import {
  GetCustomerPayemnts,
  GetSummaryCustomerPayments,
} from '../db/sql/repository/payments-repo.js'
// import { customerSchema } from '../db/schema/dvdrental.js'

const customerRouter = Router()

class CustomerController {
  static async getAll(req, res) {
    const resutls = await dbConn.select().from(customerSchema).execute()

    res.status(200).send(resutls)
  }

  static async getCustomer(req, res) {
    // console.log('POST request on user by ID', req.params.id)
    // const results = await dbConn.select().from(customerSchema).where().execute()

    const customerFound = await dbConn.query.customerSchema.findFirst({
      where: (customerSchema, { eq }) =>
        eq(customerSchema.customer_id, req.params.id),
      with: { address: true },
    })
    const [avgCustomerPayment] = await GetSummaryCustomerPayments(req.params.id)

    if (customerFound && avgCustomerPayment)
      return res
        .status(200)
        .send({ userInfo: customerFound, paymentsSummary: avgCustomerPayment })

    return res.send({ message: 'User not found' })
  }
}

customerRouter.get('/:id', CustomerController.getCustomer)
customerRouter.get('/', CustomerController.getAll)

export default customerRouter
