import { useEffect, useState, React } from 'react'
import { useUser } from '../contexts/UserContext'
import { putDay, getUser, putHabit } from '../util/axios'
import PropTypes from 'prop-types'
import { findDay, findWeek, findNumberOfDaysCompleted } from '../util/helpers'
import ConfirmUpdate from './ConfirmUpdate'
import UpdateGoal from './UpdateGoal'


function Habits (props) {
    const timezone = props.user.user.timezone || 'America/Los_Angeles'
    const localDay = new Date().toLocaleString('en-US', { timeZone: timezone }).split(',')[0]
    const today = new Date(localDay).toISOString().split('T')[0]
    const { userData, updateUserState, updateHabitCompletedState } = useUser()
    const [showUpdateGoal, setShowUpdateGoal] = useState(false)
    const [showConfirmUpdate, setShowConfirmUpdate] = useState(false)
    const [habitToUpdate, setHabitToUpdate] = useState({})
    
    // Fetch user data on component mount
    useEffect(() => {
        async function fetchUser () {
            try {
                const userId = props.user.user.id || ''
                const response = await getUser(userId)
                if (response) {
                    updateUserState(response)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchUser()
    }, [])

    async function handleDayCompletedSubmit (habit) {
        await updateHabitCompletedState(habit)
        checkFrequencyGoalMet(habit)
    }

    async function checkFrequencyGoalMet (habit) {
        const frequencyGoalMet = (findNumberOfDaysCompleted(findWeek(habit)) / habit.frequency) >= 1 ? true : false
        if (frequencyGoalMet) {
            await setHabitToUpdate(habit)
            setShowConfirmUpdate(true)
        }
    }

    async function handleConfirmUpdate () {
        setShowConfirmUpdate(false)
        setShowUpdateGoal(true)
    }

    function handleCancelUpdate () {
        setShowConfirmUpdate(false)
    }

    async function handleUpdateGoalSubmit (habit) {
        setShowUpdateGoal(false)
        await putHabit(habit)
        // Clone the current user state to avoid direct mutation
        const updatedUser = { ...userData }
        // Find the habit in the cloned state
        const habitToUpdate = updatedUser.habits.find(h => h._id === habit._id)
        if (habitToUpdate) {
            // Update the habit with the new data
            habitToUpdate.description = habit.description
            habitToUpdate.why = habit.why
            habitToUpdate.goal = habit.goal
        }
        updateUserState(updatedUser)
    }

    return (
        <div>
            <section className="bg-colorBg text-colorText rounded p-2 w-fit">
                <h2 className='text-2xl'>My Habits</h2>
                <ul className="list-inside">
                    {userData.habits && userData.habits.map(habit => (
                        <li key={habit._id} className="my-2">
                            {/* habit completed form and habit title */}
                            <div className="grid grid-flow-col grid-cols-6">
                                <h3 className='text-xl col-span-4'>{habit.emoji} {habit.name}</h3>
                                <form className='col-span-2 flex justify-end'>
                                    <label htmlFor='habitCompleteInput' className='mx-1'>
                                        {findNumberOfDaysCompleted(findWeek(habit))} / {habit.frequency} 
                                    </label>
                                    <input id='habitCompleteInput' type="checkbox" className="large-checkbox"
                                    onChange={() => handleDayCompletedSubmit(habit)} 
                                    defaultChecked={findDay(findWeek(habit), timezone).completed} 
                                    />
                                </form>
                            </div>
                            <p className="text-base">I will {habit.description}</p>
                            <p className="text-base">Because {habit.why}</p>
                            <p className="text-base">I finish my habit for the day when {habit.goal}</p>
                            {habit.frequency === 1 && <p className="text-base">I will do this habit {habit.frequency} time a week</p>}
                            {habit.frequency > 1 && <p className="text-base">I will do this habit {habit.frequency} times a week</p>}
                            {habit.streak !== undefined && <p className="text-base">My current streak is {habit.streak} days</p>}
                        </li>
                    ))}
                </ul>
            </section>
            {showUpdateGoal && <section className='h-full w-full fixed top-0 left-0 bg-gray-800 bg-opacity-50 grid grid-flow-col grid-cols-6'>
                <div className='col-span-6 md:col-span-4 md:col-start-2'>
                    <UpdateGoal habit={habitToUpdate} onCancel={() => setShowUpdateGoal(false)} onConfirm={handleUpdateGoalSubmit} />
                </div>
            </section>}
            {showConfirmUpdate && <section className='h-full w-full fixed top-0 left-0 bg-gray-800 bg-opacity-50 grid grid-flow-col grid-cols-6'>
                <div className='col-span-6 md:col-span-4 md:col-start-2'>
                    <ConfirmUpdate habit={habitToUpdate} onConfirm={handleConfirmUpdate} onCancel={handleCancelUpdate} />
                </div>
            </section>}
        </div>
    )
}

Habits.propTypes = {
    user: PropTypes.shape({
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            timezone: PropTypes.string.isRequired,
            email: PropTypes.string,
            name: PropTypes.string
        })
    }).isRequired
}

export default Habits
