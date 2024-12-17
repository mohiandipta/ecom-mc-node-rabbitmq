const express = require('express')
const cors = require('cors')
const { default: mongoose } = require('mongoose')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


mongoose.connect('mongodb://mohian:mohian12345@localhost:27017/order-db', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => {
    console.log('order db connected')
})
.catch((error) => {
    console.log(error)
})

app.listen(8002, () => {
    console.log("Order listening to Port: 8002")
})
