import express from 'express'
import Admin from '../models/admin.model.js'
import jwt from 'jsonwebtoken'

const router = express.Router()


router.get('/', async (req, res) => {
    try {
        const admin = await Admin.find().select('-password')
        res.status(200).json(admin)
    } catch (e) {
        if (e.name === 'ValidationError') {
            const validationErrors = Object.values(e.errors).map(err => err.message);
            res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            console.error(e);
            res.status(403).json({
                message: 'Login failed',
                error: e
            });
        }
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const admin = await Admin.findById(id).select('-password');
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Admin Data'
        });
    }
})





export default router