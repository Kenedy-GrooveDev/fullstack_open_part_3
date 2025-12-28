const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personShema = new mongoose.Schema({
  name: String,
  number: String,
});

personShema.set("toJSON", {
  transform: (document, resultedObject) => {
    resultedObject.id = resultedObject._id.toString();
    delete resultedObject._id;
    delete resultedObject.__v;
  },
});

module.exports = mongoose.model("Person", personShema);
