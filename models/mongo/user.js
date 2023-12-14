import mongoose from '../../db/mongo/mongoose.js'

const userSchema = mongoose.Schema({
  name: String,
  email: String,
})

const userModel = mongoose.model('User', userSchema)

export default userModel
