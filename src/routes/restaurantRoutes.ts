// fetch 10 nearby resturant and dishes 

import Router  from 'express';
import {nearbyRestaurants,itemsRestaurants,getAddress} from '../controller/food'
import authMiddleware from "../middleware/authMiddleware";

const router = Router();
console.log('In foodRoutes')
router.get('/nearby',nearbyRestaurants) // find nearby resturants and return . upto a certain distance . 
router.get('/items',itemsRestaurants) // just return resturant dishses list, restaurantId in query params 

// address of restaurant given by restaurant id
router.get('/address/:restaurantId',authMiddleware,getAddress)

export default router; 
