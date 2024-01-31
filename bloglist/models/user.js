const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  passwordHash: String,
})

schema.plugin(uniqueValidator)

schema.set('toJSON', {
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toHexString()
    delete returnedObject._id
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', schema)
