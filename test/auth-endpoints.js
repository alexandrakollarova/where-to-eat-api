const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth Endpoints', () => {
  let db 
  
  const testUsers = helpers.makeTestUsers()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/login`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )

    const requiredFields = ['user_name', 'user_password']

    requiredFields.forEach(field => {
        const loginAttemptBody = {
            user_name: testUser.user_name,
            user_password: testUser.user_password,
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
            delete loginAttemptBody[field]

            return supertest(app)
            .post('/api/login')
            .send(loginAttemptBody)
            .expect(400, {
                error: `Missing '${field}' in request body`,
            })
        })

        it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
          const userInvalidUser = { user_name: 'user-not', user_password: 'existy' }
          return supertest(app)
            .post('/api/login')
            .send(userInvalidUser)
            .expect(400, { error: `Incorrect user_name or password` })
        })

        it(`responds 400 'invalid user_name or password' when bad password`, () => {
          const userInvalidPass = { user_name: testUser.user_name, user_password: 'incorrect' }
          return supertest(app)
            .post('/api/login')
            .send(userInvalidPass)
            .expect(400, { error: `Incorrect user_name or password` })
        })

        it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
          const userValidCreds = {
            user_name: testUser.user_name,
            user_password: testUser.user_password,
          }
          
          const expectedToken = jwt.sign(
            { user_id: testUser.id }, // payload
              process.env.JWT_SECRET,
            {
              subject: testUser.user_name,
              expiresIn: process.env.JWT_EXPIRY,
              algorithm: 'HS256',
            }
          )
          return supertest(app)
            .post('/api/login')
            .send(userValidCreds)
            .expect(200, {
              authToken: expectedToken,
            })
        })
    })
  })

})