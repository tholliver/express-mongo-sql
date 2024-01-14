import dbConn from '../db/sql/dbConn.js'
import { filmSchema } from '../db/sql/schemas/index.js'
import { eq } from 'drizzle-orm'
import { Router } from 'express'
import { NotFoundError } from '../middleware/error-types.js'
import {
  getFilmById,
  getFilmByName,
  getAllFilms,
} from '../db/sql/repository/films-repo.js'

const filmRouter = Router()

class MoviesController {
  static async getMovies(req, res, next) {
    try {
      if (req.query.title !== undefined && req.query.title !== '') {
        const film = await getFilmByName(req.query.title)
        // if (!film) throw new NotFoundError('film title not found')
        return res.status(200).send(film)
      }

      const offset =
        req.query.offset !== undefined && req.query.offset !== ''
          ? req.query.offset
          : 0
      const films = await getAllFilms(offset)
      return res.status(200).send(films)
    } catch (error) {
      next(error)
    }
  }

  static async getMovieById(req, res, next) {
    try {
      const film = await dbConn.query.filmSchema.findFirst({
        where: eq(filmSchema.film_id, req.params.id),
      })

      if (!film) throw new NotFoundError('film id not found')
      return res.status(200).send(film)
    } catch (error) {
      next(error)
    }
  }
}

filmRouter.get('/', MoviesController.getMovies)
filmRouter.get('/:id', MoviesController.getMovieById)

export default filmRouter
