
import Router  from 'express';

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from '../middleware/adminMiddleware'
import {itemList,updateItem,deleteItem,createItem} from '../controller/admin'
const router = Router();

router.get('/list', authMiddleware, adminMiddleware , itemList) // find nearby resturants and return . upto a certain distance . 
router.post('/update', authMiddleware, adminMiddleware ,updateItem )
router.delete('/delete', authMiddleware, adminMiddleware , deleteItem)
router.post('/create', authMiddleware, adminMiddleware , createItem);
export default router; 
