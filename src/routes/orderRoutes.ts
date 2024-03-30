import {create,getOrderById} from '../controller/order'
import authMiddleware from "../middleware/authMiddleware";
import {Router} from 'express';


const router = Router();
router.post('/create',authMiddleware,create);
router.get('/get/:orderId',authMiddleware,getOrderById)
export default router;