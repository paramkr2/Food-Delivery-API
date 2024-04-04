import Restaurant from '../models/restaurant'

/** attach restaurantId with the res **/

 const adminMiddleware = async (req,res,next) => {
	try{
		const {restaurantOwner ,userId } = res.locals;
		console.log('admin middleware',res.locals)
		if(restaurantOwner == false ){
			return res.status(400).json({error:'Not an owner'})
		}
		// fetch the restaurantId related to user 
		const restaurant = await Restaurant.findOne({ownerId:userId})
		res.locals.restaurantId = restaurant._id;
		next();	
	}catch(error){
		return res.status(500).json({error:'Internal Server Error'})
	}
} 

export default adminMiddleware;