const bcrypt = require('bcryptjs')
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[\S]+/
                                          
const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) { 
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 6 && password.length > 72) {
        return "Password must be between 6 and 72 characters long";
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },

  checkUserInput(user_name, user_password) { console.log(user_password)
    return this.hashPassword(user_password)
      .then(hashedPassword => { 
        const newUser = {
          user_name,
          user_password: hashedPassword,
        }

        return this.insertUser(
          req.app.get('db'),
          newUser
        )
      })
  },

  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
      user_password: xss(user.user_password)
    }
  },
}

module.exports = UsersService