import Dish from '../models/dish'
import path from 'path'
import fs from 'fs/promises';

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
		
		// only update if provided 
		if (req.file) {
		  // Remove the old image file
		  if (dish.imagePath) {
			const oldImagePath = path.join(__dirname, '../../', dish.imagePath); // Construct absolute path
			await fs.unlink(oldImagePath);
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


export const deleteItem = async (req, res) => {
  try {
    const { dishId } = req.query;
    // Use findByIdAndDelete to delete the document by its ID
	const dish = await Dish.findById(dishId);
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
