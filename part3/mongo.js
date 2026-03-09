const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url = `mongodb://fullstack:${password}@ac-ulwsnel-shard-00-00.2xpoy7q.mongodb.net:27017,ac-ulwsnel-shard-00-01.2xpoy7q.mongodb.net:27017,ac-ulwsnel-shard-00-02.2xpoy7q.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-6w6ae3-shard-0&authSource=admin&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}