const { Analytics } = require('../models')

async function createAnalyticsForToday (habit, userId, timezone) {
    const today = new Date().toLocaleString('en-US', { timeZone: timezone }).split(',')[0]
    const yesterday = new Date(Date.now() - 864e5).toLocaleString('en-US', { timeZone: timezone }).split(',')[0]
    if (!existingTodaysAnalytic()) {
        const newAnalytic = {
            user: userId,
            habit: habit._id,
            date: today,
            completed: false,
            streak: 0,
            yesterdayStreak: 0
        }
        setAnalyticStreak(newAnalytic)
        await createAnalytic(newAnalytic)
    }

    // Helper functions
    function setAnalyticStreak (analytic) {
        const yesterdaysAnalytic = habit.analytics.find(analytic => {
            return analytic.date === yesterday
        })
        if (yesterdaysAnalytic && yesterdaysAnalytic.streak > 0 && yesterdaysAnalytic.completed) {
            analytic.streak = yesterdaysAnalytic.streak
            analytic.yesterdayStreak = yesterdaysAnalytic.streak
        }
    }

    function existingTodaysAnalytic () {
        return habit.analytics.find(analytic => {
            return analytic.date === today
        })
    }

    async function createAnalytic (analytic) {
        try {
            const newAnalytic = await Analytics.create(analytic)
            habit.analytics.push(newAnalytic)
            await habit.save()
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = { createAnalyticsForToday }