const { Schema, model } = require('mongoose')

const daySchema = new Schema({
    week: { type: Schema.Types.ObjectId, ref: 'Week', required: true },
    habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
    date: { type: String, required: true },
    completed: { type: Boolean, required: true }
})

module.exports = model('Day', daySchema)
