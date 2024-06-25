import { React, useState } from 'react'
import PropTypes from 'prop-types'
import HabitEdit from './HabitEdit'
import { putHabit, deleteHabit } from '../util/axios'

function ProfileSummary (props) {
    const user = props.user
    const [editHabit, setEditHabit] = useState(null)

    function handleEditHabit (habit) {
        setEditHabit(habit)
    }

    async function handleEditHabitSubmit (habit) {
        setEditHabit(null)
        await putHabit(habit)
        window.location.reload()
    }

    async function handleHabitDelete (habit) {
        setEditHabit(null)
        if (window.confirm('Are you sure you want to delete this habit?', habit.name)) {
            await deleteHabit(habit)
            window.location.reload()
        }
    }

    return (
        <section>
            <p>Username: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Timezone: {user.timezone}</p>
            {!editHabit && <ul>
                {user.habits && user.habits.map(habit => {
                    return <li className='bg-primaryBg text-primaryText rounded p-2 my-2 w-fit' key={habit._id}>
                        <div className='flex justify-between'>
                            <p>{habit.name}</p>
                            <button className='bg-primaryBg text-primaryText rounded px-2 w-fit hover:underline' onClick={() => handleEditHabit(habit)}>Edit</button>
                        </div>
                        <p>{habit.description}</p>
                        <p>{habit.why}</p>
                        <p>{habit.goal}</p>
                        <p>{habit.frequency} times a week</p>
                        {habit.reward && <p>Reward: {habit.reward}</p>}
                    </li>
                })}
            </ul>}
            {editHabit &&
            editHabit._id &&
            <HabitEdit habit={editHabit}
                onCancel={() => setEditHabit(null)}
                onSubmit={(habit) => handleEditHabitSubmit(habit)}
                onDelete={(habit) => handleHabitDelete(habit)}
            />}
        </section>
    )
}

ProfileSummary.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        timezone: PropTypes.string.isRequired,
        habits: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            why: PropTypes.string.isRequired,
            goal: PropTypes.string.isRequired,
            frequency: PropTypes.number.isRequired,
            reward: PropTypes.string
        }))
    }).isRequired
}

export default ProfileSummary
