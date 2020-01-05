const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { TEST_DB_URL, JWT_SECRET } = require('../src/config')

describe('Users Businesses Endpoint', () => {
  let db

  const testUsers = helpers.makeTestUsers()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/users_businesses`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

    it(`responds with 200 with users businesses`, () => {  
      const user = jwt.sign(
        { id: testUsers.user_id }, // payload
        JWT_SECRET,
        {
          subject: testUser.user_name,
          expiresIn: '3h',
          algorithm: 'HS256',
        }
      )

      return supertest(app)
        .get(`/api/users_businesses?user=${user}`)
       // .send(user)
        .expect(200)
    })
  })
})