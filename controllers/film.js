import dbConn from '../db/sql/dbConn.js'
import { filmSchema } from '../db/sql/schemas/index.js'
import { eq } from 'drizzle-orm'
import { Router } from 'express'
import { NotFoundError } from '../middleware/error-types.js'
import {
  getFilmById,
  getFilmByTitle,
  getAllFilms,
  getFilmByCategory,
  getFilmByCategoryAndName,
} from '../db/sql/repository/films-repo.js'

const filmRouter = Router()

class FilmsController {
  static async searchFilms(req, res, next) {
    const { category, title } = req.query
    const offset = parseInt(req.query.offset) || 0
    try {
      if (category && title) {
        const categorizedFilm = await getFilmByCategoryAndName(
          title,
          category,
          offset
        )
        return res.status(200).send(categorizedFilm)
      }

      if (category && !title) {
        const filmsByCategory = await getFilmByCategory(category, offset)
        return res.status(200).send(filmsByCategory)
      }

      if (title && !category) {
        const film = await getFilmByTitle(title, offset)
        return res.status(200).send(film)
      }

      const films = await getAllFilms(offset)
      return res.status(200).send(films)
    } catch (error) {
      next(error)
    }
  }

  static async getFilms(req, res, next) {
    const { offset } = req.query
    try {
      const films = await getAllFilms(offset || 0)
      return res.status(200).send(films)
    } catch (error) {
      next(error)
    }
  }

  static async getFilmById(req, res, next) {
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

filmRouter.get('/', FilmsController.getFilms)
filmRouter.get('/search', FilmsController.searchFilms)
filmRouter.get('/:id', FilmsController.getFilmById)

export default filmRouter
