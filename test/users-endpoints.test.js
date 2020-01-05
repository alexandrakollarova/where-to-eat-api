const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { TEST_DB_URL, JWT_SECRET } = require('../src/config')

describe('Users Endpoint', () => {
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

  describe(`POST /api/users`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

    const signupAttemptBody = {
      user_name: {
        value: "ValidName"
      },
      user_password: {
        value: "ValidPassword1*"
      }
    }

    it(`responds with 400 required when username is missing`, () => {
      signupAttemptBody.user_name = ""

      return supertest(app)
        .post('/api/users')
        .send(signupAttemptBody)
        .expect(400, {
          error: `Missing 'user_name' in request body`,
        })
    })

    it(`responds with 400 when password doesn't meet the requirements`, () => {
      signupAttemptBody.user_name = { value : "ValidName" }
      signupAttemptBody.user_password.value = "invalidPassword"

      return supertest(app)
        .post('/api/users')
        .send(signupAttemptBody)
        .expect(400, {
          error: `Password must contain one upper case, lower case, number and special character`
        })
    })

    it(`responds with 400 required when username is already taken`, () => {
      signupAttemptBody.user_name.value = "demo_user"
      signupAttemptBody.user_password.value = "ValidPassword1*"

      return supertest(app)
        .post('/api/users')
        .send(signupAttemptBody)
        .expect(400, {
          error: `Username already taken`,
        })
    })
  })
})