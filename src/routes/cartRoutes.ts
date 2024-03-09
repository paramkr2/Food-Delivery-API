import {addItem,getItem,removeItem,updateItem,confirmOrder} from '../controller/cart'
import authMiddleware from "../middleware/authMiddleware";
import {Router} from 'express';


const router = Router();
router.post('/add',authMiddleware,addItem); // adding item to the cart 
router.get('/fetch',authMiddleware,getItem); // getting the cart items 
router.delete('/remove', authMiddleware,removeItem) ; // removing items from the cart 
router.put('/update',authMiddleware,updateItem);
router.post('/confirmOrder',authMiddleware,confirmOrder)
export default router;