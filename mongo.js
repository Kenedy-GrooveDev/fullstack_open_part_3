const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstackPhonebook:${password}@phonebook.iubye2q.mongodb.net/?appName=phonebook`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personShema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personShema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length > 3) {
  if (process.argv.length === 5) {
    person.save().then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close();
    });
  } else if (process.argv.length === 4) {
    console.log("complete the missing argument");
    mongoose.connection.close();
  }
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
