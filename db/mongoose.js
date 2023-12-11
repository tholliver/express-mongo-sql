const config = require('../utils/config')
const mongoose = require('mongoose')

mongoose
  .connect(config.MONGO_URI, {})
  .then(() => {
    console.log('Connected to the MONGO database')
  })
  .catch((error) => {
    console.log(error)
  })

module.exports = mongoose
