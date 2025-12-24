const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 })

const personShema = new mongoose.Schema({
  name: String,
  number: String
})

personShema.set('toJSON', {
  transform: (document, resultedObject) => {
    resultedObject.id = resultedObject._id.toString()
    delete resultedObject._id
    delete resultedObject.__v
  }
})

module.exports = mongoose.model('Person', personShema)
