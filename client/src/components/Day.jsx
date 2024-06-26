import { React, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function Day (props) {
    const month = new Date().getMonth()
    const weekDay = new Date().getDay()
    const date = new Date().getDate()
    const numbers = ['0', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st']
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const timezone = props.user.user.timezone
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone }))

    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone }))
            setInterval(() => {
                setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone }))
            }, 60000)
        }, (60 - new Date().getSeconds()) * 1000)
        return () => clearTimeout(timer)
    }, [timezone])

    return (
        <>
            <section className="bg-colorBg text-colorText rounded p-2 w-full text-2xl">
                <h2>Today is {days[weekDay]}, {months[month]} {numbers[date]} </h2>
                <p>{ time }</p>
            </section>
        </>
    )
}

Day.propTypes = {
    user: PropTypes.shape({
        user: PropTypes.shape({
            id: PropTypes.string,
            timezone: PropTypes.string.isRequired,
            email: PropTypes.string,
            name: PropTypes.string
        })
    }).isRequired
}

export default Day
