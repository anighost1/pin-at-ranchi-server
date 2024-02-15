import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const { Schema } = mongoose;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    accessLevel: {
        type: String,
        required: true,
        default: 'L2'
    },
    status: {
        type: Boolean,
        default: true
    },
});

adminSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

adminSchema.post('save', function (doc, next) {
    console.log('Added document: ', doc)
    next()
})

adminSchema.statics.login = async function (email, password) {
    const admin = await this.findOne({ email })
    if (admin) {
        const auth = await bcrypt.compare(password, admin.password)
        if (auth) {
            return admin
        } else {
            throw 'Incorrect password'
        }
    } else {
        throw 'Invalid email'
    }
}

const Admin = mongoose.model('Admin', adminSchema)
export default Admin