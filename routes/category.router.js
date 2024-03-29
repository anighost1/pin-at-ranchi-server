import express from 'express'

import Category from '../models/category.model.js'

const router = express.Router()


//find all data
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    let dataToSend = {}
    try {
        const itemData = await Category.find().skip(startIndex).limit(limit);
        const count = await Category.countDocuments();
        const totalPage = Math.ceil(count / limit)
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
        dataToSend.currentPage = page
        dataToSend.currentLimit = limit
        dataToSend.totalPage = totalPage
        res.json(dataToSend);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving category'
        });
    }
})


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

//update data
router.put('/', async (req, res) => {
    const dataToUpdate = req.body
    try {
        const oldIData = await Category.findByIdAndUpdate(dataToUpdate._id, dataToUpdate)
        // console.log(oldIData)
        res.status(200).json({
            message: 'Category successfully updated'
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
                message: 'Category updation unsuccessful'
            });
        }
    }
})

//status change
router.put('/status', async (req, res) => {
    const id = req.body.id
    try {
        const result = await Category.findById(id)
        result.status = !result.status
        result.save()
        res.status(200).json({
            message: `Status changed to ${result.status ? 'Active' : 'Inactive'}`
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Status change unsuccessful'
        });
    }
})


export default router