import { React, useState, useEffect } from 'react'
import StartingPointList from '../components/StartingPointList'
import DescriptionSelection from '../components/DescriptionSelection'

function NewHabit () {
    const [habit, setHabit] = useState(null)

    // useEffects
    // Check if there is a new habit in progress in local storage
    useEffect(() => {
        const localStorageHabit = JSON.parse(localStorage.getItem('newHabit'))
        if (localStorageHabit) {
            const contiueWithHabit = window.confirm(`You left off creating a new habit in progress. Do you want to continue with ${localStorageHabit.name}?`)
            if (contiueWithHabit) {
                setHabit(localStorageHabit)
                // TODO: when user confirms to continue, set the page to show the next step they were on
                setShowStartingPointList(false)
            } else {
                localStorage.removeItem('newHabit')
                setShowStartingPointList(true)
            }
        }
    }, [])
    // Save habit to local storage
    useEffect(() => {
        console.log(habit)
        localStorage.setItem('newHabit', JSON.stringify(habit))
    }, [habit])

    // Starting Points
    const [showStartingPointList, setShowStartingPointList] = useState(true)
    const startingPoints = [
        {
            name: 'Exercise',
            descriptionOptions: [
                'Go for a run, jog, or walk',
                'Do some exercises at home',
                'Do some yoga',
                'Go to the gym'
            ],
            icon: '🏋️‍♂️'
        },
        {
            name: 'Eat Healthy',
            icon: '🥗'
        },
        {
            name: 'Meditation',
            icon: '🧘‍♂️'
        },
        {
            name: 'Reading',
            icon: '📚'
        },
        {
            name: 'Writing',
            icon: '📝'
        },
        {
            name: 'Drawing',
            icon: '🎨'
        },
        {
            name: 'Coding',
            icon: '💻'
        },
        {
            name: 'Learning a new language',
            icon: '🌐'
        },
        {
            name: 'Playing an instrument',
            icon: '🎸'
        },
        {
            name: 'Create a new habit',
            icon: '🚀'
        }
    ]
    const handleStartingPointSelection = (newHabit) => {
        setHabit(newHabit)
        setShowStartingPointList(false)
        setShowDescriptionSelection(true)
    }

    // Set Habit Description
    const setHabitDescription = (description) => {
        setHabit({ ...habit, description })
    }
    const [showDescriptionSelection, setShowDescriptionSelection] = useState(false)

    return (
        <section className="flex flex-col rounded-md m-2 bg-secondaryBg text-secondaryText p-2 shadow-xl">
            <h2 className='text-xl'>Create a New Habit</h2>
            <p>To help accelerate the process of creating a new habit we gave you some starting points.
            You will make goals and define your habit soon, this is just a starting point to get you going!</p>
            {showStartingPointList && <StartingPointList startingPoints={startingPoints} onItemClick={handleStartingPointSelection} />}
            {showDescriptionSelection && <DescriptionSelection descriptions={startingPoints} onItemClick={setHabitDescription} />}
        </section>
    )
}

export default NewHabit
