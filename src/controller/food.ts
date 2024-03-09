import Cart from '../models/cart'
import Restaurant from '../models/restaurant'
import Dish from '../models/dish'


export const nearbyRestaurants = async (req,res) => {
	try{
		let {location} = req.query 
		const query = {
		  location: {
			$nearSphere: {
			  $geometry: {
				type: 'Point',
				coordinates: location.coordinates || [0,0],
			  },
			  $maxDistance: 10000, // Set your maximum distance for nearby locations
			},
		  },
		};
		// getting list of resturants 
		const list = await Restaurant.find(query)
		console.log('In nearbyResturants', list);
		return res.status(200).json(list);
	}catch(err){
		console.log(err)
		res.status(500).send({error:'Internal Server Error'})
	}
}

export const itemsRestaurants = async (req,res) => {
	return res.status(200)
}

export const bestfood = async (req,res) => {
	return res.status(200)
}
