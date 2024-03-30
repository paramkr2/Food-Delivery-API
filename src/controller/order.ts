import Order from '../models/order';

export const create = async (req, res) => {
  try {
    const { userId } = res.locals;
    const { paymentIntentId, total, cart } = req.body;
    
    /* todo calculate and verify total amount 
       2. Check if restaurantId exists?
    */

    
    // Format items
	const formattedItems = Object.keys(cart.items).map( (index) => (
	{ dishId : cart.items[index]._id, quantity:cart.items[index].quantity}
	))
	console.log(formattedItems);

    const order = await Order.create({
      userId,
      restaurantId: cart.restaurantId,
      totalAmount: total,
      items: formattedItems, // items should be a list with dishId and quantity
      paymentIntentId
    });

    res.status(201).json({ msg: 'success' });
  } catch (error) {
    console.log('Order confirmation error', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    let order;

    if (orderId === 'recent') {
      // Find the latest order
      order = await Order.findOne().sort({ created_at: 1 });
    } else {
      // Find the order by ID
      order = await Order.findById(orderId);
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
	console.log('orderbyid', order );

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
