import {addItem,getItem,removeItem,updateItem} from 'cart'
import {authMiddleware} from '../middleware/authMiddleware';
import {Router} from 'express';

/** 
Todo ; 
	Add auth middle , to verify user token and append id to body 
**/ 

const router = Router();
router.post('/add',addItem); // adding item to the cart 
router.get('/fetch',getItem); // getting the cart items 
router.delete('/remove',removeItem} ; // removing items from the cart 
router.put('/update',updateItem);

export default router;