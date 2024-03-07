//import {addItem,getItem,removeItem,updateItem} from '../controller/cart'
import {addItem,getItem,removeItem} from '../controller/cart';
import authMiddleware from "../middleware/authMiddleware";
import {Router} from 'express';


const router = Router();
router.post('/add',authMiddleware,addItem); // adding item to the cart 
router.get('/fetch',authMiddleware,getItem); // getting the cart items 
router.delete('/remove', authMiddleware,removeItem) ; // removing items from the cart 
//router.put('/update',updateItem);

export default router;