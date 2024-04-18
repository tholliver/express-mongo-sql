import dbConn from '../dbConn.js'
import { sql, sum, between, desc, eq } from 'drizzle-orm'
import { timeLapseConverter } from '../../../utils/repos-utils.js'
import {
  filmSchema,
  inventorySchema,
  rentalSchema,
  paymentSchema,
} from '../schemas/index.js'

export const GetTopRentedFilmsTimeLapsed = async (time, lapse) => {
  const timelapseTyped = timeLapseConverter(time, lapse)
  const queryRes = await dbConn
    .select({
      film_id: filmSchema.film_id,
      filmName: filmSchema.title,
      amountMade: sum(paymentSchema.amount),
      rating: filmSchema.rating,
      rentedTimes: sql`count(${filmSchema.film_id})`,
    })
    .from(filmSchema)
    .innerJoin(inventorySchema, eq(filmSchema.film_id, inventorySchema.film_id))
    .innerJoin(
      rentalSchema,
      eq(inventorySchema.inventory_id, rentalSchema.inventory_id)
    )
    .innerJoin(
      paymentSchema,
      eq(rentalSchema.rental_id, paymentSchema.rental_id)
    )
    .where(
      between(
        rentalSchema.rental_date,
        sql`${timelapseTyped}`,
        sql`CURRENT_DATE`
      )
    )
    .groupBy(filmSchema.film_id)
    .orderBy(desc(sql`count(${filmSchema.film_id})`))

  return queryRes
}

export const GetTopRentedFilms = async () => {
  const queryRes = await dbConn
    .select({
      film_id: filmSchema.film_id,
      filmName: filmSchema.title,
      amountMade: sum(paymentSchema.amount),
      rating: filmSchema.rating,
      rentedTimes: sql`count(${filmSchema.film_id})`,
    })
    .from(filmSchema)
    .innerJoin(inventorySchema, eq(filmSchema.film_id, inventorySchema.film_id))
    .innerJoin(
      rentalSchema,
      eq(inventorySchema.inventory_id, rentalSchema.inventory_id)
    )
    .innerJoin(
      paymentSchema,
      eq(rentalSchema.rental_id, paymentSchema.rental_id)
    )
    .groupBy(filmSchema.film_id)
    .orderBy(desc(sql`count(${filmSchema.film_id})`))

  return queryRes
}

export const GetRentsByDateGroup = async (by) => {
  const groupBy = {
    day: { spec: 'day', format: 'YYYY-MM-DD' },
    month: { spec: 'month', format: 'YYYY-MM' },
    year: { spec: 'year', format: 'YYYY' },
  }

  return await dbConn.execute(
    sql.raw(`select TO_CHAR(DATE_TRUNC('${groupBy[by].spec}', return_date), '${groupBy[by].format}') AS date, count(*) 
    from 
    rental
    group by DATE_TRUNC('${groupBy[by].spec}', return_date)
    order by date
    limit 7
    `)
  )
}
