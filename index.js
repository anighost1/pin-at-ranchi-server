const express = require('express')
const mongoose = require('mongoose')
const connectDb = require('./config/dbConfig')

const itemRouter = require('./routes/item.router')
const categoryRouter = require('./routes/category.router')

const app = express()
app.use(express.json())
const port = process.env.PORT || 6969

connectDb()
const db = mongoose.connection;

app.get('/', (req, res) => {
    res.send('Pin at Ranchi')
})

app.use('/api/item', itemRouter)
app.use('/api/category', categoryRouter)


db.once('open', () => {
    console.log('DB connection successful')
    app.listen(port, () => {
        console.log(`Pin at Ranchi server is listening on port ${port}`)
    })
})
