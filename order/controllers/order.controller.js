const Order = require('../models/Order.model')

const createOrder = async (products) => {
    let total = 0
    
    products.forEach((ele) => {
        total+=ele.price;
    })

    const order = await new Order({
        products,
        total
    })

    await order.save()

    return order;
}

module.exports = createOrder
