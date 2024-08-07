import moment from 'moment-timezone'

const splitEmoji = (string) => [...new Intl.Segmenter().segment(string)].map(x => x.segment)

const findDay = (week, timezone) => {
    const today = moment().tz(timezone).format('YYYY-MM-DD')
    const day = week.days.find(day => day.date === today)
    return day
}

const findWeek = (habit) => {
    const week = habit.weeks[habit.weeks.length - 1]
    return week
}

const daysCompletedInWeek = (week) => {
    let daysCompleted = 0
    week.days.forEach(day => {
        if (day.completed === true) {
            daysCompleted++
        }
    })
    return daysCompleted
}

function validateHabit (habit, timezone) {
    if (!findDay(findWeek(habit), timezone)) {
        return false
    }
}

function validateEmail (email) {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

function validateUsername (username) {
    const re = /^[a-zA-Z0-9]{6,}$/
    return re.test(username)
}

function validatePassword (password, confirmPassword) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    if (password !== confirmPassword) {
        return false
    }
    return re.test(password)
}

function validateLoginPassword (password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return re.test(password)
}

function validateTimezone (timezone) {
    const timezones = [
        'Pacific/Midway',
        'Pacific/Honolulu',
        'America/Anchorage',
        'America/Los_Angeles',
        'America/Phoenix',
        'America/Denver',
        'America/Chicago',
        'America/New_York',
        'America/Caracas',
        'America/Halifax',
        'America/St_Johns',
        'America/Argentina/Buenos_Aires',
        'America/Sao_Paulo',
        'Atlantic/Azores',
        'Europe/London',
        'Europe/Paris',
        'Europe/Istanbul',
        'Europe/Moscow',
        'Asia/Dubai',
        'Asia/Karachi',
        'Asia/Dhaka',
        'Asia/Jakarta',
        'Asia/Shanghai',
        'Asia/Tokyo',
        'Australia/Sydney',
        'Pacific/Auckland'
    ]
    return timezones.includes(timezone)
}

export { splitEmoji, findDay, findWeek, daysCompletedInWeek, validateEmail, validateUsername, validatePassword, validateLoginPassword, validateTimezone, validateHabit }