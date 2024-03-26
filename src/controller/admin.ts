import Dish from '../models/dish'

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
    
    // Ensure that all required fields are provided
    if (!name || !price || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the item
    const item = await Dish.create({ name, price, description, restaurantId });
    
    // Send the created item as response
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { dishId, name, price, description  } = req.body;
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    dish.name = name || dish.name;
    dish.price = price || dish.price ;
    dish.description = description || dish.description;
    await dish.save();
    res.status(200).json({ msg: 'Successfully updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteItem = async (req, res) => {
  try {
    const { dishId } = req.query;
    // Use findByIdAndDelete to delete the document by its ID
    await Dish.findByIdAndDelete(dishId);
    res.status(200).json({ msg: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
