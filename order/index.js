const express = require('express')
const cors = require('cors')
const { default: mongoose } = require('mongoose')
const amqp = require('amqplib')
const createOrder = require('./controllers/order.controller')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


mongoose.connect('mongodb://mohian:mohian12345@localhost:27017/order-db?authSource=admin', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => {
    console.log('order db connected')
})
.catch((error) => {
    console.log(error)
})

async function connectToRabbitMQ() {
    const amqpServer = await 'amqp://guest:guest@localhost:5673'
    connection = await amqp.connect(amqpServer)

    channel = await connection.createChannel()
    await channel.assertQueue('order-service-queue')
}

connectToRabbitMQ()
.then(() => {
    channel.consume('order-service-queue', async (data) => {
        try {
            const { product } = JSON.parse(data.content.toString())
            const newOrder = await createOrder(product)

            channel.ack(data)
            channel.sendToQueue('product-service-queue', Buffer.from(JSON.stringify(newOrder)))
        } catch (error) {
            console.error('Error processing message:', error.message);
            channel.nack(data, false, false); // Reject the message
        }
    })
})
.catch((error) => {
    console.log(error)
})


app.listen(8002, () => {
    console.log("Order listening to Port: 8002")
})
