const express = require('express')
const AuthService = require('./auth-service')

const AuthRouter = express.Router()
const jsonBodyParser = express.json()

AuthRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const user_name = req.body.user_name.value
        const user_password = req.body.user_password.value

        const loginUser = { user_name, user_password }
        console.log(loginUser)
        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
              return res.status(400).json({
                  error: `Missing '${key}' in request body`
            })

        AuthService.getUserWithUserName(
            req.app.get('db'),
            loginUser.user_name
        )
        .then(dbUser => {
            if (!dbUser)
                return res.status(400).json({
                    error: 'Incorrect username or password',
                })
    
                return AuthService.comparePasswords(loginUser.user_password, dbUser.user_password)
                    .then(compareMatch => {
                        if (!compareMatch)
                            return res.status(400).json({
                                error: 'Incorrect username or password',
                            })

                            const sub = dbUser.user_name
                            const payload = { user_id: dbUser.id }
                            res.send({
                                authToken: AuthService.createJwt(sub, payload),
                            })
                    })
 
        })
        .catch(next)
    })

// AuthRouter
//     .post('/refresh', requireAuth, (req, res) => {
//         const sub = req.user.user_name
//         const payload = { user_id: req.user.id }
//         res.send({
//             authToken: AuthService.createJwt(sub, payload),
//         })
//     })
    
module.exports = AuthRouter