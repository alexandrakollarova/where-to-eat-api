const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeTestUsers() {
    return [
      {
        id: 1,
        user_name: "demo_user",
        user_password: "demo_password"
      }
    ]
}

function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          users
        `
      )
    )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users')
    .insert(preppedUsers)
    //.then(() =>
    // update the auto sequence to stay in sync
      // db.raw(
      //   `SELECT setval('blogful_users_id_seq', ?)`,
      //   [users[users.length - 1].id],
      // )
    //)
}


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
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
    seedUsers
  }
  