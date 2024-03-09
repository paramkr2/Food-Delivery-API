// fetch 10 nearby resturant and dishes 

import Router  from 'express';
import {nearbyRestaurants,itemsRestaurants} from '../controller/food'
const router = Router();

router.get('/nearbyRestaurants',nearbyRestaurants) // find nearby resturants and return . upto a certain distance . 
router.get('/itemsRestaurants',itemsRestaurants) // just return resturant dishses list
export default router; 
