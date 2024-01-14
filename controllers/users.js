import { Router } from 'express'
import userModel from '../db/mongo/models/user.js'
import { NotFoundError } from '../middleware/error-types.js'
const userRouter = Router()

class UserControlller {
  static async getUser(req, res, next) {
    const username = req.query.username
    const searchKey = req.params.id
      ? { _id: `${req.params.id}` }
      : { username: username }
    try {
      const userFound = await userModel.findOne(searchKey)

      if (!userFound) throw new NotFoundError('no user found')
      return res.status(200).send(userFound)
    } catch (error) {
      next(error)
    }
  }
}

userRouter.get('/:id?', UserControlller.getUser)
// userRouter.get('/', UserControlller.get)

export default userRouter
