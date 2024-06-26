import express from 'express'
import { corsMiddleware } from './cors.js'
import customerRouter from './controllers/customer.js'
import storeRouter from './controllers/store.js'
import staffRouter from './controllers/staff.js'
import userRouter from './controllers/users.js'
import filmRouter from './controllers/film.js'
import paymentRouter from './controllers/payment.js'
import { ErrorHandler, requestLogger } from './middleware/index.js'
import rentalRouter from './controllers/rental.js'
import statsRouter from './controllers/stats.js'
import categoryRouter from './controllers/category.js'

const app = express()

// app.use(requestLogger)
app.use(corsMiddleware())

app.use('/users', userRouter)
app.use('/stores', storeRouter)
app.use('/categories', categoryRouter)
app.use('/customers', customerRouter)
app.use('/staff', staffRouter)
app.use('/films', filmRouter)
app.use('/payments', paymentRouter)
app.use('/rentals', rentalRouter)
app.use('/stats', statsRouter)

app.use(ErrorHandler)

app.get('/', (req, res) => {
  res.status(200).send({ message: 'welcome to my api' })
})

export default app
