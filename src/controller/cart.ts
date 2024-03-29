import Cart from '../models/cart';
import Dish from '../models/dish';
import Order from '../models/order'
import mongoose from 'mongoose';

export const getItem = async (req, res) => {
  try {
	console.log('fetchitem')
    const { userId } = res.locals;
    const cart = await Cart.findOne({ userId });
    if (!cart) { return res.status(200).json({ msg: 'empty' }); }
    let data = {};
    for (const cartItem of cart.dishes) {
      const dishFull = await Dish.findById(cartItem._id);
      if (!dishFull) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      data[cartItem._id.toString()] =dishFull ;
    }
    return res.status(200).json({...data});
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' , actual:err});
  }
};

export const addItem = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { itemId, quantity, forceAdd } = req.body;
	
    // Check if item exists
    const foodItem = await Dish.findById(itemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Fetch cart object
    let userCart = await Cart.findOne({ userId });

    // If cart not present yet
	if (!userCart) {
      userCart = new Cart({ userId, restaurantId: foodItem.restaurantId, dishes: [] });
    }else if (String(userCart.restaurantId) !== String(foodItem.restaurantId)) {
      // If restaurants are different
	 //userCart.dishes = [] ;
		 if( !forceAdd ){
			console.log(`Restaruant Id Mismatch food_rid:${ foodItem.restaurantId} userCart:${userCart.restaurantId} `)
			return res.status(405).json({message:'Resturant Mismatch'});
		 }
		 userCart.dishes.splice(0, userCart.dishes.length);
		 userCart.restaurantId = foodItem.restaurantId;
    }
	

    // Check if the item is already in the cart
    const existingIndex = userCart.dishes.findIndex(dish => dish._id.equals(foodItem._id));

    if (existingIndex !== -1) {
      // Update quantity if the item is already in the cart
      userCart.dishes[existingIndex].quantity = quantity;
    } else {
      // Add a new item to the cart
      userCart.dishes.push({ _id:foodItem._id, quantity  });
    }
    await userCart.save();
	
	const addedItem = userCart.dishes.find(dish => dish._id.equals(foodItem._id));
    return res.status(201).json({ msg: 'Food item added to cart', item: addedItem });
  } catch (error) {
	console.log('Add Cart Item error',error)
    return res.status(500).json({ msg: 'Internal Server Error', error });
  }
};

export const removeItem = async (req,res) => {
	try{
		const {userId} = res.locals
		const {dishId} = req.query 
		
		const cart = await Cart.findOne({userId})
		if( !cart ){
			res.status(404).json({error:'Cart not found'})
		}
		
		await Cart.updateOne({_id:userId},{$pull:{dishes:dishId}}) // pulling an elment out of the array
		
		// since we already have cart, we should use below 
		//await cart.dishes.pull({_id: new mongoose.Types.ObjectId(dishId)})
		//await cart.save();
		res.status(200).send({msg:'Successfully Deleted'})
	}catch(err){
	
		if (err.name === 'CastError' || err.name === 'BSONError') {
		 // happens if the recived dishId is not in a format which id should be
		  return res.status(400).json({ error: 'Invalid dishId format' });
		}
		return res.status(500).json({error:'Internal Server Error',more:err.toString()});
		
	}
}

export const updateItem = async (req,res) => {
	try{
		const {userId} = res.locals;
		const {dishId,quantity} = req.body 
		console.log(`In updateItem ${userId} , ${dishId} , ${quantity}`)
		const cart = await Cart.findOne({userId})
		
		if(!cart){
			return res.status(404).json({error:'Cart not found'})
		}
		await Cart.updateOne(
			{userId,'dishes._id':dishId},
			{$set:{'items.$.quantity':quantity}}
		)
		return res.status(200).json({msg:'Sucessfully Update'})
	}catch(err){
		console.log(err)
		return res.status(500).json({error:'Internal Server Error'})
	}
	
}

export const confirmOrder = async (req, res) => {
  try {
    const { userId } = res.locals;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const totalAmount = await cart.dishes.reduce(async (amountPromise, dishItem) => {
	// because we normally have synchronous callback, 
      let amount = await amountPromise; 
      const dish = await Dish.findById(dishItem._id);

      if (dish) { amount += dish.price * dishItem.quantity; }
      return amount;
    }, Promise.resolve(0));

    const order = await Order.create({
      userId,
      restaurantId: cart.restaurantId,
      dishes: cart.dishes,
      totalAmount, // Fix the variable name
      delivered: false,
    });
	await Cart.deleteOne({ userId });
	
	/* 
	Todo: 
		We also need to assign a delivery driver and send the order details back . 
	
	*/
	
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
