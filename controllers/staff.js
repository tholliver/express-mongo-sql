import dbConn from '../db/sql/dbConn.js'
import { Router } from 'express'
// import { eq, and } from 'drizzle-orm'
import bcrypt from 'bcrypt'
// import { config } from '../../config.js'

const staffRouter = Router()

class StaffController {
  static async getStaffMember(req, res, next) {
    const { email, password } = req.body
    if (!email && !password) return res.send({ message: 'No info provided' })
    const user = await dbConn.query.staffSchema.findFirst({
      where: (staffSchema, { eq, and }) =>
        and(eq(staffSchema.email, email), eq(staffSchema.password, password)),
    })

    const passCorrect =
      user === undefined ? false : bcrypt.compare(password, user.password)

    if (!user && !passCorrect) {
      return res.status(401).json({ error: 'Invalid password or email' })
    }

    return res
      .status(200)
      .send({ username: user.usuario, email: user.email, token: token })
  }
}

staffRouter.post('/login', StaffController.getStaffMember)

export default staffRouter
