const mongoose = require('mongoose')


if (process.argv.length<3) {
    console.log('give password as an argument')
    process.exit(1)
  }

  const password = process.argv[2]

  const url =`mongodb+srv://haliasandrei:${password}@cluster0.mofjpwg.mongodb.net/?retryWrites=true&w=majority`

  mongoose.set('strictQuery',false)
  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

 if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
  } else {
    const name = process.argv.slice > 4 && (process.argv[3].startswith('"') && process.argv[process.argv.length -1].endsWith('"'))
    ? process.argv.slice(3, -1).join(' ').slice(1, -1)
    : process.argv[3]
  
    const number = process.argv[process.argv.length - 1]
  
    const person = new Person({
      name: name,
      number: number,
    })
  
    person.save().then((result) =>{
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
  }

