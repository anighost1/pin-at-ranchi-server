const mongoose = require('mongoose')
const { Schema } = mongoose;

const imageSchema = new Schema({
    itemId: {
        type: mongoose.Types.ObjectId,
        ref:'Item',
        required: true
    },
    path: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
});

const Image = mongoose.model('Image', imageSchema)
module.exports = Image