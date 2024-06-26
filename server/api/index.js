const { authMiddleware } = require('../utils/auth')
const router = require('express').Router()
const userController = require('./userController')
const habitController = require('./habitController')
const weekController = require('./weekController')
const dayController = require('./dayController')
const auth = require('../utils/auth')
const { User } = require('../models')

router.use('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            console.log('no user found')
            res.status(401).json({ message: 'No user with that email!' })
            return
        }
        if (!user.checkPassword(req.body.password, user.salt)) {
            console.log('password incorrect')
            res.status(401).json({ message: 'Wrong password!' })
            return
        }
        user = user.toObject()
        delete user.salt
        delete user.password
        const token = auth.signToken(user)
        res.cookie('habitTrackerToken', token, { secure: false, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 })
        res.json({ user })
    })
})

router.use('/checkToken', authMiddleware, async (req, res) => {
    res.json({ user: req.user })
})

router.use('/users', userController)
router.use('/habits', habitController)
router.use('/weeks', weekController)
router.use('/days', dayController)

module.exports = router
