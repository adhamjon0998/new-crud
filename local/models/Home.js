const { Schema, model } = require('mongoose')
const homeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String
    }
})

module.exports = model('home', homeSchema)