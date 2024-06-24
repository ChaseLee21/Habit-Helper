const { Day, Week } = require('../models')

async function endOfWeek (user) {
    // helper functions
    function EndDatePassed (habit) {
        return habit.weeks[habit.weeks.length - 1].endDate < new Date()
    }

    function updateStreak (habit) {
        const lastWeek = habit.weeks[habit.weeks.length - 1]
        let daysCompleted = 0
        for (const day of lastWeek.days) {
            if (day.completed) {
                daysCompleted++
            }
        }
        if (daysCompleted < lastWeek.frequency) {
            habit.streak = 0
        }
    }

    async function createNewWeek (habit, timezone) {
        const newWeek = await Week.create({ habit: habit._id, user: user._id })
        habit.weeks.push(newWeek)
    }

    for (const habit of user.habits) {
        if (EndDatePassed(habit)) {
            // Check if frequency was met and update streak
            await updateStreak(habit)
            // Create new week document
            await createNewWeek(habit, user.timezone)
            // Save habit
            await habit.save()
        }
    }

    await user.save()
}

function setEndDate (timezone) {
    // set now to today in the user's timezone
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }))
    const today = now.getDay()

    // number of days til next the next Saturday, if today is Saturday, it will be 7
    const daysUntilNextSaturday = (6 - today + 7) % 7 || 7

    // nextSaturday is the date of the next Saturday
    const nextSaturday = new Date(now)
    nextSaturday.setDate(now.getDate() + daysUntilNextSaturday)
    nextSaturday.setHours(0, 0, 0, 0)

    // set endDate to the next Saturday
    return nextSaturday
}

async function setDaysArray (endDate, weekId) {
    const days = []
    for (let i = 0; i < 7; i++) {
        const day = await Day.create(
            {
                date: endDate.getDate() - i,
                completed: false,
                week: weekId
            })
        days.push(day)
    }
    return days
}

module.exports = { endOfWeek, setEndDate, setDaysArray }
