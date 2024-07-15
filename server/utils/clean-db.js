const express = require('express')
const db = require('../config/connection.js')
const cors = require('cors')
const { User, Habit, Week, Day } = require('../models/index.js')
const { deleteDay, deleteWeek } = require('../utils/helpers.js')

// Create an Express app
const app = express()

// Middleware to allow react to connect to the server during development
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
db.once('open', async () => {
    console.log('Connected to MongoDB')

    // habits without a user
    const habits = await Habit.find()
    for (let habit of habits) {
        let user = await User.findOne({ _id: habit.user })
        if (!user) console.log('habit with no user', habit)
    }

    // users with habits that no longer exists
    // users without habits
    const users = await User.find()
    for (let user of users) {
        if (!user.habits.length || user.habits.length < 1) console.log('user with no habit', user._id, user.name, user.email)
        for (let habit of user.habits) {
            let habitDoc = await Habit.findOne({ _id: habit })
            if (!habitDoc) {
                console.log('user with a habit that no longer exists', user._id, user.name, user.email, habit)
                user.habits = user.habits.filter(h => h !== habit)
                await user.save()
            } 
        }
    }

    // weeks / days without a habit
    console.log('checking weeks & days without a habit')
    const weeks = await Week.find()
    for (let week of weeks) {
        let habit = await Habit.findOne({ _id: week.habit })
        if (!habit) {
            deleteWeek(week)
            for (let day of week.days) {
                let dayDoc = await Day.findOne({ _id: day })
                if (dayDoc) {
                    habit = await Habit.findOne({ _id: dayDoc.habit })
                    if (!habit) deleteDay(dayDoc)
                }
            }
        }
    }

    db.close()
})
