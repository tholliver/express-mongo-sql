import { MONGO_URI } from '../../config/index.js'
import mongoose from 'mongoose'

mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log('Connected to the MONGO database')
  })
  .catch((error) => {
    console.error(error)
  })

export default mongoose
