const router = require('express').Router()
const userModel = require('../models/mongo/user')
const userRouter = router

userRouter.get('/:id', async (req, res) => {
  const userFound = await userModel.findOne({ _id: `${req.params.id}` })

  res.send({ user: userFound })
})

module.exports = userRouter
