import { React, useState } from 'react'
import PropTypes from 'prop-types'

function FrequencySelection ({ onItemClick }) {
    const [frequency, setFrequency] = useState(1)
    const handleInputChange = (e) => {
        setFrequency(e.target.value)
    }
    return (
        <div className='p-2 bg-colorBgAlt rounded-md cursor-pointer'>
            <select className='rounded w-full px-1' id='frequency' onChange={handleInputChange}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
            </select>
            <button className='bg-colorButtonBgAlt text-colorButtonTextAlt rounded w-fit p-1 my-2' onClick={() => onItemClick(frequency)}>Next</button>
        </div>
    )
}

FrequencySelection.propTypes = {
    onItemClick: PropTypes.func.isRequired
}

export default FrequencySelection
