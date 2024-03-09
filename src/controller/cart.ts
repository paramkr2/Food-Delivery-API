import Cart from '../models/cart';
import Dish from '../models/dish';
import mongoose from 'mongoose';

export const getItem = async (req, res) => {
  try {
    const { userId } = res.locals;
    const cart = await Cart.findOne({ userId });
    if (!cart) { return res.status(404).json({ error: 'Cart Not Found' }); }
    let data = {};
    for (const cartItem of cart.dishes) {
      const dishFull = await Dish.findById(cartItem._id);
      if (!dishFull) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      data[cartItem._id.toString()] = {
        id: dishFull._id,
        name: dishFull.name,
        price: dishFull.price
      };
    }
    return res.status(200).json({data});
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
    }else if (userCart.restaurantId !== foodItem.restaurantId) {
      // If restaurants are different
	 //userCart.dishes = [] ;
	 if( !forceAdd ){
		return res.status(405).json({message:'Resturant Mismatch'});
	 }
	 userCart.dishes.splice(0, userCart.dishes.length);
     userCart.restaurantId = foodItem.restaurantId;
    }
	

    // Check if the item is already in the cart
    const existingIndex = userCart.dishes.findIndex(dish => dish.id.equals(userId));

    if (existingIndex !== -1) {
      // Update quantity if the item is already in the cart
      userCart.dishes[existingIndex].quantity += quantity;
    } else {
      // Add a new item to the cart
      userCart.dishes.push({ _id:foodItem._id, quantity });
    }

    await userCart.save();

    return res.status(201).json({ msg: 'Food item added to cart' });
  } catch (error) {
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