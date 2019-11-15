const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    getUserWithUserName(db, user_name) {
      return db('users')
        .where({ user_name })
        .first()
    },
    
    comparePasswords(password, hash) {
      return bcrypt.compare(password, hash)
    },

    createJwt(subject, payload) {
      console.log(subject); 
      console.log(payload);
      console.log(jwt.sign(payload, config.JWT_SECRET, {
        subject,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256',
      }))
      return jwt.sign(payload, config.JWT_SECRET, {
        subject,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256',
      })
    },

    verifyJwt(token) {
      return jwt.verify(token, config.JWT_SECRET, {
        algorithms: ['HS256'],
      })
    },
    
    parseBasicToken(token) {
      return Buffer
        .from(token, 'base64')
        .toString()
        .split(':')
    },
}
  
module.exports = AuthService