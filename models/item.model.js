const mongoose = require('mongoose')
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref:'Category',
        required: true
    },
    longitude: {
        type: Number,
        min: -180,
        max: 180
    },
    latitude: {
        type: Number,
        min: -90,
        max: 90
    },
    contact: {
        type: String
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    pin: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{6}$/.test(v);
            },
            message: props => `${props.value} is not a valid 6-digit pin code!`
        }
    },
    map: {
        type: String
    },
});

const Item = mongoose.model('Item', itemSchema)
module.exports = Item