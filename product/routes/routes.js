const Router = require('express').Router
const router = new Router()
const Product = require('../model/product')
const amqp = require('amqplib')

let connection, channel, order

async function connectToRabbitMQ() {
    const amqpServer = await 'amqp://guest:guest@localhost:5672'
    connection = await amqp.connect(amqpServer)

    channel = await connection.createChannel()
    await channel.assertQueue('product-service-queue')
}

connectToRabbitMQ()

router.post('/', async (req, res) => {
    const {name, price, quantity} = req.body
    if (!name || !price || !quantity) {
        return res.status(400).json({
            message: 'Please provide product details'
        })
    }

    const product = await new Product({name, price, quantity})
    await product.save()

    res.status(200).json({
        message: 'Product created successfully'
    })
})

router.post('/buy', async (req, res) => {
    const {productId} = req.body
    if (!productId) {
        return res.status(400).json({
            message: 'Please provide product id'
        })
    }

    const product = await Product.find({_id: {$in: productId}})
    
    channel.sendToQueue('order-service-queue', 
        Buffer.from(JSON.stringify({product}))
    )

    channel.consume('product-service-queue', (data) => {
        console.log('Consumed from product service queue!')

        order = JSON.parse(data)
        channel.ack(data)
    })


    return res.status(200).json({
        message: 'Order places successfully!'
    })
})

module.exports = router