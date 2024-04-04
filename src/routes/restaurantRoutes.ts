// fetch 10 nearby resturant and dishes 

import Router  from 'express';
import {nearbyRestaurants,itemsRestaurants,getAddress,addressUpdate} from '../controller/restaurant'
import adminMiddleware from '../middleware/adminMiddleware'
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

//  for everyone 
router.get('/nearby',nearbyRestaurants) // find nearby resturants and return . upto a certain distance . 
router.get('/items',itemsRestaurants) // just return resturant dishses list, restaurantId in query params 

// Below are Routes for admins or restaurant owner 
router.post('/address',authMiddleware,adminMiddleware,addressUpdate)

// address of restaurant given by restaurant id , only for signed user
router.get('/address/:restaurantId',authMiddleware,getAddress)

export default router; 
