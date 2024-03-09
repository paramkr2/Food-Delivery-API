// fetch 10 nearby resturant and dishes 

import Router  from 'express';
import {nearbyRestaurants,itemsRestaurants, bestfood} from '../controller/food'
const router = Router();

router.use('/nearbyRestaurants',nearbyRestaurants) // find nearby resturants and return . upto a certain distance . 
router.use('/itemsRestaurants',itemsRestaurants) // just return resturant dishses list
router.use('/bestfood',bestfood) // based on rating of food 

export default router; 
