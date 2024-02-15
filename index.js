
import express from 'express'
import mongoose from 'mongoose'
import connectDb from './config/dbConfig.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import itemRouter from './routes/item.router.js'
import categoryRouter from './routes/category.router.js'
import imageRouter from './routes/image.router.js'
import authRouter from './routes/auth.router.js'
import adminRouter from './routes/admin.router.js'

const app = express()
app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://paradmin.tigga.in',
        'https://paradmin.onrender.com'
    ],
    credentials: true,
}))
app.use(cookieParser())
const port = process.env.PORT || 6969

connectDb()
const db = mongoose.connection;

app.get('/', (req, res) => {
    res.send('Pin at Ranchi')
})

app.use('/api/item', itemRouter)
app.use('/api/category', categoryRouter)
app.use('/api/image', imageRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

let gfs;
db.once('open', () => {
    console.log('DB connection successful')
    gfs = new mongoose.mongo.GridFSBucket(db.db)
    app.listen(port, () => {
        console.log(`Pin at Ranchi server is listening on port ${port}`)
    })
})

export { gfs }