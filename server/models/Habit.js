const { Schema, model, default: mongoose } = require('mongoose')

const habitSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    why: { type: String, required: true },
    goal: { type: String, required: true },
    reward: { type: String, required: false },
    frequency: { type: Number, required: true },
    streak: { type: Number, required: false },
    weeks: [{ type: Schema.Types.ObjectId, ref: 'Week' }],
    emoji: { type: String, required: false }
})

habitSchema.pre('save', async function () {
    if (!this.isNew) {
        return
    }
    this.streak = 0
    const Week = mongoose.model('Week')
    const firstWeek = await Week.create(
        {
            habit: this._id,
            user: this.user
        })
    this.weeks.push(firstWeek)
})

module.exports = model('Habit', habitSchema)
