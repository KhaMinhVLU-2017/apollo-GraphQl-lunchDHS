var mongoose = require('mongoose')

var food = new mongoose.Schema({
    title: String,
    price: Number,
    unit: String
})

module.exports = mongoose.model('Foods', food)