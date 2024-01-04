const express = require('express')

const Category = require('../models/category.model')

const router = express.Router()


router.get('/', async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    let dataToSend = {}
    try {
        const itemData = await Category.find().skip(startIndex).limit(limit);
        const count = await Category.countDocuments();
        dataToSend.data = itemData
        if (endIndex < count) {
            dataToSend.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            dataToSend.prev = {
                page: page - 1,
                limit: limit
            }
        }
        res.json(dataToSend);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving category'
        });
    }
})



//find all data
// router.get('/', async (req, res) => {
//     try {
//         const itemData = await Category.find();
//         res.json(itemData);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Error retrieving category'
//         });
//     }
// })

//find data by id
router.get('/:id', async (req, res) => {
    const itemId = req.params.id
    try {
        const itemData = await Category.findById(itemId);
        res.json(itemData);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving category'
        });
    }
})

//insert data
router.post('/', async (req, res) => {
    const newItem = new Category(req.body)
    try {
        await newItem.save()
        res.status(200).json({
            message: 'Category successfully inserted'
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
                message: 'Category insertion unsuccessful'
            });
        }
    }
})


module.exports = router