require('dotenv').config()

const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

const where_to_eat_db = knex({
  client: 'pg',
  connection: DATABASE_URL
})

app.set('where_to_eat_db', where_to_eat_db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})