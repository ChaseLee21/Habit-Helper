const { User } = require('../models/index')
const { endOfWeek } = require('../utils/helpers')
const router = require('express').Router()
const { signToken } = require('../utils/auth')

// Get user by id
// Check if any new instances of Week document need to be created for the user
// Check if streak needs to be updated for each habit
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        // Find user by id and populate habits, weeks, and days
        const user = await User.findOne({ _id: id }).populate({
            path: 'habits',
            model: 'Habit',
            populate: {
                path: 'weeks',
                model: 'Week',
                populate: {
                    path: 'days',
                    model: 'Day'
                }
            }
        })
        // 404 error if no user found
        if (!user) return res.status(404).json({ message: 'No user found with this id' })
        // Check if any new instances of Week document need to be created for the user
        // Updates streak for each habit if necessary
        await endOfWeek(user)
        await user.save()
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// POST a new user
router.post('/', async (req, res) => {
    const userData = req.body
    try {
        let user = await User.create(userData)
        if (!user) return res.status(400).json({ message: 'User could not be created' })
        user = user.toObject()
        delete user.password
        delete user.salt
        const token = signToken(user)
        res.cookie('HabitTrackerToken', token, { httpOnly: true })
        res.status(201).json(user)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

// PUT updated user by id
router.put('/:id', (req, res) => {
    const { id } = req.params
    const userData = req.body
    User.findOneAndUpdate({ _id: id }, { $set: userData })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'No user found with this id' })
                return
            }
            res.status(200).json({ message: 'User updated successfully', user })
        })
        .catch((err) => {
            res.status(400).json(err.message)
        })
})

// DELETE user by id
router.delete('/:id', (req, res) => {
    const { id } = req.params
    User.findOneAndDelete({ _id: id })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'No user found with this id' })
                return
            }
            res.status(200).json({ message: 'User deleted successfully' })
        })
        .catch((err) => {
            res.status(400).json(err)
        })
})

module.exports = router
