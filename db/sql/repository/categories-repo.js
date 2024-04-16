import dbConn from '../dbConn.js'

export const getAllCategories = async () => {
  return await dbConn.query.categorySchema.findMany()
}
