// fetch 10 nearby resturant and dishes 

import Router  from 'express';
import {createCharge} from '../controller/payment'
import authMiddleware from "../middleware/authMiddleware";
const router = Router();

router.get('/create', authMiddleware , createCharge) // find nearby resturants and return . upto a certain distance . 

export default router; 
