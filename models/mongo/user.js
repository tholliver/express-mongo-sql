const mongoose = require('../../db/mongoose')

const userSchema = mongoose.Schema({
  name: String,
  email: String,
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel
