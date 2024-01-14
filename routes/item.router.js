const express = require('express')
const fs = require('fs')

const Item = require('../models/item.model')

const router = express.Router()


router.get('/', async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    let dataToSend = {}
    try {
        const itemData = await Item.find().populate('category').skip(startIndex).limit(limit);
        const count = await Item.countDocuments();
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
            message: 'Error retrieving items'
        });
    }
})

//data with its images
router.get('/with-image', async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    let dataToSend = {}
    try {
        const itemData = await Item.find().populate('category').populate('images').skip(startIndex).limit(limit);
        const count = await Item.countDocuments();
        const totalPage = Math.ceil(count / limit)
        itemData.forEach((item) => {
            let imgArray = []
            item?.images.forEach(img => {
                const buffer = fs.readFileSync(`${img.destination}/${img.filename}`)
                const base64 = Buffer.from(buffer).toString('base64')
                imgArray.push({
                    ...img._doc,
                    image: `data:${img.mimetype};base64,${base64}`
                })
            });
            item.images = imgArray
        })
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
            message: 'Error retrieving items'
        });
    }
})

//data by id with its images
router.get('/with-image/:id', async (req, res) => {
    const itemId = req.params.id
    try {
        const itemData = await Item.findById(itemId).populate('category').populate('images');
            let imgArray = []
            itemData?.images.forEach(img => {
                const buffer = fs.readFileSync(`${img.destination}/${img.filename}`)
                const base64 = Buffer.from(buffer).toString('base64')
                imgArray.push({
                    ...img._doc,
                    image: `data:${img.mimetype};base64,${base64}`
                })
            });
            itemData.images = imgArray
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