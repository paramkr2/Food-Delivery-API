import Dish from '../models/dish'
import Order from '../models/order'
import Driver from '../models/driver'
import RestaurantAddress from '../models/restaurantAddress'
import Restaurant from '../models/restaurant'
import path from 'path'
import fs from 'fs/promises';
import { startOfDay, endOfDay } from 'date-fns';

export const itemList = async (req, res) => {
  try {
    const { restaurantId } = res.locals;
    const items = await Dish.find({ restaurantId });
	console.log('itemList',items)
    res.status(200).json(items); // Send array of items
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createItem = async (req, res) => {
  try {
    const { restaurantId } = res.locals;
    const { name, price, description } = req.body;
	
	console.log( 'in createitem',req.body,res.locals ,req.file)
    
    // Ensure that all required fields are provided
	if (!name || !price || !description || !req.file) {
		  return res.status(400).json({ error: 'Missing required fields' });
	}
	const imagePath = req.file.path; 
    // Create the item
    const item = await Dish.create({ name, price, description, restaurantId, imagePath });
    // Send the created item as response
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateItem = async (req, res) => {
	/* 
	Remove the old file if we have a newImage file 
	*/
	  try {
		const { dishId, name, price, description  } = req.body;
		const dish = await Dish.findById(dishId);
		if (!dish) {
		  return res.status(404).json({ error: 'Dish not found' });
		}
		dish.name = name || dish.name;
		dish.price = price || dish.price ;
		dish.description = description || dish.description;
		console.log('admin update req.file is :', req.file)
		// only update if provided 
		if (req.file) {
		  // Remove the old image file
		  if (dish.imagePath) {
			const oldImagePath = path.join(__dirname, '../../', dish.imagePath); // Construct absolute path
			try{
				await fs.unlink(oldImagePath);
			}catch{
				console.log('Old image path present but actual file unavailable')
			}
		  }
		  // Update the imagePath with the path of the new image file
		  dish.imagePath = req.file.path;
		}
		
		await dish.save();
		res.status(200).json(dish);
	  } catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	  }
};

export const history = async( req,res) => {
	try{
		const { restaurantId } = res.locals;
		const todayStart = startOfDay(new Date());
		const todayEnd = endOfDay(new Date());

		const orders = await Order.find({
			restaurantId,
			createdAt: { $gte: todayStart, $lte: todayEnd }
		})
		.sort({ createdAt: -1 });

		res.status(200).send(orders);
		
	}catch(err){
		res.status(500).send({error:'Internal server error'})
	}

}


export const deleteItem = async (req, res) => {
  try {
    const { dishId } = req.query;
    // Use findByIdAndDelete to delete the document by its ID
	const dish = await Dish.findById(dishId);
	if( !dish ){ return res.status(400).json({msg:'Dish not found'})}
	console.log('In delete item',dish)
	if (dish.imagePath) {
		const oldImagePath = path.join(__dirname, '../../', dish.imagePath); // Construct absolute path
		await fs.unlink(oldImagePath);
	  }
	 await Dish.findByIdAndDelete(dishId);
    res.status(200).json({ msg: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const acceptOrder = async (req, res) => {
	/* todo , not accept until payment is made  */
	
 try {
    const { restaurantId } = res.locals;
    const { orderId } = req.params; // Corrected destructuring
    
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ error: 'Order not found' }); // Changed to return
    }
    
  // Changed status to 'Accepted'
    
	// we dont need to await.. but just doing for .. testing right now 
    const assignedOrder = await assignDriverToOrder(order); 
     assignedOrder.status = 'Preparing';
	await assignedOrder.save();
	
	res.status(200).send(assignedOrder); // Corrected response message
  } catch (error) { // Added error parameter
    console.error('Error accepting order:', error); // Log the error
    res.status(500).send({ error: 'Internal server error' }); // Send internal server error response
  }
};
// Function to assign a driver to the order
const assignDriverToOrder = async (order) => {
  try {
	const restaurantAddress = await RestaurantAddress.findOne({restaurantId:order.restaurantId})
	console.log('location restaurant ', restaurantAddress.location.coordinates)
    const updateResult = await Driver.findOneAndUpdate(
      { availability: true, location: { $nearSphere: restaurantAddress.location.coordinates } },
      { $set: { availability: false } },
      { new: true } // Return the updated driver document
    );
	
	console.log( 'In assignDriver',updateResult );
    if (updateResult) {
      order.driverId = updateResult._id;
      await order.save();
      console.log(`Driver ${updateResult.name} assigned to order ${order._id}`);
		return order ;
	} else {
      console.log(`No available drivers found near the restaurant for order ${order._id}`);
    }
  } catch (error) {
    console.error('Error assigning driver to order:', error);
  }
};

export const updateRestaurantInformation = async ( req,res ) => {
	try{
		console.log('In Edit RestaurantInformation')
		const {name,description,phone} = req.body;
		const {restaurantId} = res.locals;
		
		const restaurant = await Restaurant.findById(restaurantId);
		restaurant.name = name || restaurant.name;
		restaurant.description = description || restaurant.description;
		restaurant.phone = phone || restaurant.phone;
		
		if (req.file) {
		  // Remove the old image file
		  if (restaurant.imagePath) {
			const oldImagePath = path.join(__dirname, '../../', restaurant.imagePath); // Construct absolute path
			await fs.unlink(oldImagePath);
		  }
		  // Update the imagePath with the path of the new image file
		  restaurant.imagePath = req.file.path;
		}
		
		await restaurant.save();
		
		return res.status(200).send(restaurant)
		
	}catch(err){
		console.log('Error updating restaurant Infromation', err)
		res.status(500).send({msg:'Internal Server Error'})
	}
}

export const getRestaurantInformation = async( req,res) => {

	try{
		const {restaurantId} = res.locals;
		
		const restaurant = await Restaurant.findById(restaurantId);
		res.status(200).send(restaurant)
	}catch(err){
		console.log('Get Restaurant Information', err);
		res.status(500).send({msg:'Internal server error'})
	}
}