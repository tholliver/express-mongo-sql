import dbConn from '../dbConn.js'
import { filmSchema } from '../schemas/index.js'
import { ilike } from 'drizzle-orm'

export const getAllFilms = async (offset) => {
  return await dbConn.select().from(filmSchema).limit(10).offset(offset)
}

export const getFilmByName = async (title) => {
  return await dbConn.query.filmSchema.findMany({
    where: ilike(filmSchema.titulo, `%${title}%`),
  })
}

export const getFilmById = async (filmId) => {
  return await dbConn
    .select()
    .from(filmSchema)
    .where(eq(customerSchema.customer_id, filmId))
}
