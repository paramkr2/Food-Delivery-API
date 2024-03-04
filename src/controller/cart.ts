import Cart from '../models/cart';


const addItem = async (req,res) => {

	try{
		let userid = req.locals.userid ;
		let { itemid,quantity } = req.body ;
		
		// check if item exists 
		const footitem = await Dish.findById(itemid)
		if( !foodItem ){
			return res.status(404).json({message:'Food item not found'})
		}
		// find the cart object for userid 
		
		//fetch cart object 
		let userCart = await Cart.findOne({userId})
		
		// if cart not present yet 
		if(!userCart){
			userCart = new Cart({userId,dishes:[]});
		}
		
		//check if already in the cart 
		const existingIndex = userCart.dishes.findIndex(dish => dish.id.equals(itemId));
		
		if( existingIndex !== -1 ){
			// we can send update quantity 
			userCart.dishes[existingIndex].quantity += quantity ;
		}else{
			userCart.dishes.push( {itemid,quantity});
		}
		return res.status(201).json({msg:"Food item added to cart});
	}catch(error){
		return res.status(500).json({msg:'Internel Server Error ' , error })	
	}
}