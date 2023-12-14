import { MONGO_URI } from '../../utils/config.js'
import mongoose from 'mongoose'

mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log('Connected to the MONGO database')
  })
  .catch((error) => {
    console.log(error)
  })

export default mongoose
