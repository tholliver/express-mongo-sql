import dbConn from '../db/sql/dbConn.js'
import { filmSchema } from '../db/sql/schemas/index.js'
import { eq } from 'drizzle-orm'
import { Router } from 'express'
import { NotFoundError } from '../middleware/error-types.js'

const filmRouter = Router()

class MoviesController {
  static async getMovie(req, res, next) {
    console.log(req.query.title)
    try {
      const film = await dbConn.query.filmSchema.findFirst({
        where: eq(filmSchema.titulo, req.query.title),
      })
      console.log('Movie found', film)

      if (!film) throw new NotFoundError('film tittle not found')
      return res.staus(200).send(film)
    } catch (error) {
      next(error)
    }
  }
}

filmRouter.get('/', MoviesController.getMovie)

export default filmRouter
