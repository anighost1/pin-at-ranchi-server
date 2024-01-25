import express from 'express'
import upload from '../config/imageUploadConfig.js'
// import fs from 'fs'
import { fs } from 'memfs'
import { Readable } from 'stream'
import generateUniqueFileName from '../service/randomNameGenerator.js'
import { gfs } from '../index.js'

import Image from '../models/image.model.js'
import mongoose from 'mongoose'
import imageRetriever from '../service/imageRetriever.js'


const router = express.Router()

//find all data
router.get('/', async (req, res) => {
    let imgArray = []
    try {
        const imgData = await Image.find();
        imgData.forEach(img => {
            const buffer = fs.readFileSync(`${img.destination}/${img.filename}`)
            const base64 = Buffer.from(buffer).toString('base64')
            imgArray.push({
                ...img._doc,
                image: `data:${img.mimetype};base64,${base64}`
            })
        });
        res.json(imgArray)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Images'
        });
    }
})

//find all data of specific item id
router.get('/by-item/all/:id', async (req, res) => {
    const itemId = req.params.id
    let imgArray = []
    try {
        const imgData = await Image.find({ itemId });
        await Promise.all(
            imgData.map(async (img) => {
                await imageRetriever(img, imgArray)
            })
        );
        fs.unlinkSync('/outputFile');
        // console.log(imgArray)
        res.json(imgArray)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Images'
        });
    }
})

//find data by Item id
router.get('/by-item/:id', async (req, res) => {
    const itemId = req.params.id
    try {
        const imgData = await Image.findOne({ itemId });
        const buffer = fs.readFileSync(`${imgData.destination}/${imgData.filename}`)
        const base64 = Buffer.from(buffer).toString('base64')
        res.json({
            ...imgData._doc,
            image: `data:${imgData.mimetype};base64,${base64}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving image'
        });
    }
})

//find data by id
router.get('/:id', async (req, res) => {
    const imgId = req.params.id
    try {
        const imgData = await Image.findById(imgId);
        const buffer = fs.readFileSync(`${imgData.destination}/${imgData.filename}`)
        const base64 = Buffer.from(buffer).toString('base64')
        res.json({
            ...imgData._doc,
            image: `data:${imgData.mimetype};base64,${base64}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving image'
        });
    }
})



// //insert data
// router.post('/', upload.single('itemImage'), async (req, res) => {
//     const imageData = req.file
//     const dataToWrite = {
//         ...imageData,
//         ...req.body
//     }
//     const newImg = new Image(dataToWrite)
//     try {
//         await newImg.save()
//         res.status(200).json({
//             message: 'Image successfully uploaded'
//         })
//     } catch (e) {
//         if (e.name === 'ValidationError') {
//             const validationErrors = Object.values(e.errors).map(err => err.message);
//             res.status(400).json({
//                 message: 'Validation error',
//                 errors: validationErrors
//             });
//         } else {
//             console.error(e);
//             res.status(500).json({
//                 message: 'Image upload unsuccessful'
//             });
//         }
//     }
// })



// //insert multiple data at once
// router.post('/', upload.array('itemImage'), async (req, res) => {
//     const imageData = req.files
//     if (imageData.length < 1) {
//         res.status(404).json({
//             message: 'No Image found'
//         });
//         return
//     }
//     try {
//         await Promise.all(
//             imageData.map(item => new Image({ ...item, ...req.body }).save())
//         )
//         res.status(200).json({
//             message: 'Image(s) successfully uploaded'
//         })
//     } catch (e) {
//         if (e.name === 'ValidationError') {
//             const validationErrors = Object.values(e.errors).map(err => err.message);
//             res.status(400).json({
//                 message: 'Validation error',
//                 errors: validationErrors
//             });
//         } else {
//             console.error(e);
//             res.status(500).json({
//                 message: 'Image upload unsuccessful'
//             });
//         }
//     }
// })

//insert image data and save the buffer in gridfs
router.post('/', upload.array('itemImage'), async (req, res) => {
    const imageData = req.files
    // console.log(imageData)
    if (imageData.length < 1) {
        res.status(404).json({
            message: 'No Image found'
        });
        return
    }
    try {
        await Promise.all(
            imageData.map((item) => {
                const uploadStream = gfs.openUploadStream(generateUniqueFileName(item.originalname))
                const readStream = Readable.from(item.buffer)
                const result = readStream.pipe(uploadStream)
                uploadStream.once('finish', () => {
                    console.log(uploadStream.id)
                    delete item.buffer
                    console.log(item)
                    console.log(req.body)
                    new Image({
                        gridfsId: uploadStream.id,
                        ...item,
                        ...req.body
                    }).save()
                })
            })
        )
        res.status(200).json({
            message: 'Image(s) successfully uploaded',
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
                message: 'Image upload unsuccessful'
            });
        }
    }
})


export default router