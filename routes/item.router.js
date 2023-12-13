const express = require('express')
const mongoose = require('mongoose')

const Item = require('../models/item.model')

const router = express.Router()


router.get('/', async (req, res) => {
    const itemData = await Item.find()
    res.json(itemData)
})

router.post('/', async (req, res) => {
    const newItem = new Item(req.body)
    try {
        await newItem.save()
        res.status(200).json({
            message: 'Item successfully inserted'
        })
    } catch (e) {
        if (e.name === 'ValidationError') {
            // Handle validation errors
            const validationErrors = Object.values(e.errors).map(err => err.message);
            res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            // Handle other types of errors
            console.error(e);
            res.status(500).json({
                message: 'Item insertion unsuccessful'
            });
        }
    }
})


module.exports = router