const mongoose = require('mongoose')
const { Schema } = mongoose;

const imageSchema = new Schema({
    itemId: {
        type: mongoose.Types.ObjectId,
        ref:'Item',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    },
    size: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: true
    },
});

const Image = mongoose.model('Image', imageSchema)
module.exports = Image