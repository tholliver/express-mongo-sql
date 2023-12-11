const express = require('express')
const { PORT } = require('./utils/config')
const corsMiddleware = require('./cors')
const userRouter = require('./controllers/users')

const app = express()

app.use('/users', userRouter)

app.get('/', (req, res) => {
  res.status(200).send({ message: 'welcome to my api' })
})

app.use(corsMiddleware())

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`)
})
