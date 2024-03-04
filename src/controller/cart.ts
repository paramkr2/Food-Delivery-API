import Cart from '../models/cart';
import Dish from '../models/dish';

export const addItem = async (req, res) => {
  try {
    const userId = res.locals.userId;
	console.log('In addItem userId:', userId)
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
      userCart.dishes.push({ userId, quantity });
    }

    await userCart.save();

    return res.status(201).json({ msg: 'Food item added to cart' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal Server Error', error });
  }
};

