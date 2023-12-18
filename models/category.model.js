const mongoose = require('mongoose')
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    Keyword: {
        type: Array,
    },
});

const Category = mongoose.model('Category', categorySchema)
module.exports = Category