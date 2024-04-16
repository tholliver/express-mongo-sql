import dbConn from '../dbConn.js'
import { categorySchema, film_category, filmSchema } from '../schemas/index.js'
import { and, ilike, eq, getTableColumns } from 'drizzle-orm'

export const getAllFilms = async (offset) => {
  return await dbConn.select().from(filmSchema).limit(10).offset(offset)
}

export const getFilmByTitle = async (title, offset) => {
  return await dbConn
    .select({ ...getTableColumns(filmSchema) })
    .from(filmSchema)
    .where(ilike(filmSchema.title, `%${title}%`))
    .limit(10)
    .offset(offset)
}

export const getFilmByCategory = async (category, offset) => {
  return await dbConn
    .select({
      ...getTableColumns(filmSchema),
    })
    .from(categorySchema)
    .innerJoin(
      film_category,
      eq(categorySchema.category_id, film_category.category_id)
    )
    .innerJoin(filmSchema, eq(film_category.film_id, filmSchema.film_id))
    .where(eq(categorySchema.name, category))
    .limit(10)
    .offset(offset)
}

export const getFilmByCategoryAndName = async (title, category, offset) => {
  return await dbConn
    .select({
      ...getTableColumns(filmSchema),
    })
    .from(categorySchema)
    .innerJoin(
      film_category,
      eq(categorySchema.category_id, film_category.category_id)
    )
    .innerJoin(filmSchema, eq(film_category.film_id, filmSchema.film_id))
    .where(
      and(
        ilike(filmSchema.title, `%${title}%`),
        eq(categorySchema.name, category)
      )
    )
    .limit(10)
    .offset(offset)
}

export const getFilmById = async (filmId) => {
  return await dbConn
    .select()
    .from(filmSchema)
    .where(eq(filmSchema.film_id, filmId))
}

// ORM TRY
// return await dbConn.query.categorySchema.findMany({
//   where: eq(categorySchema.name, category),
//   with: {
//     categoryToFilms: {
//       with: {
//         film: {
//           where: (film, { ilike }) => ilike(film.title, `%${title}%`),
//         },
//       },
//     },
//   },
// })
