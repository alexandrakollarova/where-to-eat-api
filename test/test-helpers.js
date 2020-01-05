const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../src/config')

function makeTestUsers() {
  return [
    {
      user_id: 1,
      user_name: "demo_user",
      user_password: "demo_password"
    }
  ]
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE users, business, user_businesses`
    )
  )
}

function seedUsers(db, users) { 
  const preppedUsers = users.map(user => ({
    user_name: user.user_name,
    user_password: bcrypt.hashSync(user.user_password, 1)
    })
  )
  return db
    .into('users')
    .insert(preppedUsers)
    .returning('*')
    .then(([user]) => user)
}

function hasUserWithUserName(db, user_name) {
  return db('users')
    .where({ user_name })
    .first()
    .then(user => !!user)
}

function makeAuthHeader(user, secret = JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeTestUsers,
  cleanTables,
  makeAuthHeader,
  seedUsers,
  hasUserWithUserName
}
