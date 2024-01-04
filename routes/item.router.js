const express = require('express')

const Item = require('../models/item.model')

const router = express.Router()

//find all data
router.get('/', async (req, res) => {
    try {
        const itemData = await Item.find().populate('category');
        res.json(itemData);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving items'
        });
    }
})

//find data by id
router.get('/:id', async (req, res) => {
    const itemId = req.params.id
    try {
        const itemData = await Item.findById(itemId);
        res.json(itemData);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving items'
        });
    }
})

//insert data
router.post('/', async (req, res) => {
    const newItem = new Item(req.body)
    try {
        await newItem.save()
        res.status(200).json({
            message: 'Item successfully inserted'
        })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const validationErrors = Object.values(e.errors).map(err => err.message);
            res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        } else {
            console.error(e);
            res.status(500).json({
                message: 'Item insertion unsuccessful'
            });
        }
    }
})


module.exports = router