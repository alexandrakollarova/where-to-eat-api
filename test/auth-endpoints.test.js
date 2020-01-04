const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { TEST_DB_URL, JWT_SECRET } = require('../src/config')

describe('Auth Endpoint', () => {
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

  describe(`POST /api/login`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

    const loginAttemptBody = {
      user_name: {
        value: testUser.user_name
      },
      user_password: {
        value: testUser.user_password
      }
    }

    it(`responds with 400 required when username is missing`, () => {
      delete loginAttemptBody.user_name.value

      return supertest(app)
        .post('/api/login')
        .send(loginAttemptBody)
        .expect(400, {
          error: `Missing 'user_name' in request body`,
        })
    })

    it(`responds 400 'invalid username or password' when bad username provided`, () => {
      const userInvalidUser = {
        user_name: {
          value: 'wrongUsername'
        },
        user_password: {
          value: loginAttemptBody.user_password
        }
      }

      return supertest(app)
        .post('/api/login')
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect username or password` })
    })

    it(`responds 400 'invalid username or password' when bad password provided`, () => {
      const userInvalidUser = {
        user_name: {
          value: loginAttemptBody.user_name
        },
        user_password: {
          value: 'wrongPassword'
        }
      }

      return supertest(app)
        .post('/api/login')
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect username or password` })
    })

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      loginAttemptBody.user_name.value = testUser.user_name

      const expectedToken = jwt.sign(
        { user_id: testUsers.id }, // payload
        JWT_SECRET,
        {
          subject: testUser.user_name,
          expiresIn: '3h',
          algorithm: 'HS256',
        }
      )

      return supertest(app)
        .post('/api/login')
        .send(loginAttemptBody)
        .expect(200, {
          authToken: expectedToken,
        })
    })
  })

})