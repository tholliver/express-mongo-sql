import { Router } from 'express'
import { getAllCategories } from '../db/sql/repository/categories-repo.js'

const categoryRouter = Router()

class CategoryController {
  static async getAll(req, res, next) {
    try {
      const categoriesFound = await getAllCategories()
      return res.status(200).send(categoriesFound)
    } catch (error) {
      next(error)
    }
  }
}

categoryRouter.get('/', CategoryController.getAll)

export default categoryRouter
