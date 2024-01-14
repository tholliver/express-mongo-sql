import dbConn from '../dbConn.js'
import { sql } from 'drizzle-orm'

export const GetRentsByDateGroup = async (by) => {
  const groupBy = {
    day: { spec: 'day', format: 'YYYY-MM-DD' },
    month: { spec: 'month', format: 'YYYY-MM' },
    year: { spec: 'year', format: 'YYYY' },
  }

  return await dbConn.execute(
    sql.raw(`select TO_CHAR(DATE_TRUNC('${groupBy[by].spec}', fecha_de_renta), '${groupBy[by].format}') AS date, count(*) 
    from 
    rental
    group by DATE_TRUNC('${groupBy[by].spec}', fecha_de_renta)
    order by date
    limit 7
    `)
  )
}
