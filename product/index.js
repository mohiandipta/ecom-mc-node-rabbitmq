const express = require('express')
const cors = require('cors')
const productRouter = require('./routes/routes')
const { default: mongoose } = require('mongoose')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use('/product', productRouter)

mongoose.connect('mongodb://mohian:mohian12345@localhost:27017/product-db?authSource=admin', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => {
    console.log('product db connected')
})
.catch((error) => {
    console.log(error)
})

app.listen(8001, () => {
    console.log("Product listening to Port: 8002")
})
