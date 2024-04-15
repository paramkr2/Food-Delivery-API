import Order from '../models/order';

export const create = async (req, res) => {
  try {
    const { userId } = res.locals;
    const { paymentIntentId, total, cart } = req.body;
    console.log( 'order recieved body', req.body)
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

    res.status(201).json(order);
  } catch (error) {
    console.log('Order confirmation error', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

let userId: string;
export const list = async (req, res) => {
    try {
		console.log('fetching order list ')
         userId  = res.locals.userId ;
        let { page } = req.query; // Use req.query to get the query parameters from the URL

        if (!page) {
            page = 1; // If page parameter is not provided, default to 1
        } else {
            page = parseInt(page); // Convert page to integer
        }

        const size = 5;

        const orders = await Order.find({ userId })
            .sort({ created_At: -1 })
            .skip( (page - 1) * size)
            .limit(size);

        const totalOrders = await Order.countDocuments({ userId });
        const totalPages = Math.ceil(totalOrders / size);

        return res.status(200).json({ totalPages, orders });
    } catch (err) {
        console.log('orderlist error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};




export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const {userId} = res.locals;
    let order;
    // add some validation that it is a valid OrderId string later 
    if (orderId === 'recent') {
      // Find the latest order
      order = await Order.find({ userId }).sort({ created_at: -1 }).limit(1);
      console.log('recent order', order )
      order = order[0] // because find returns and array 

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


