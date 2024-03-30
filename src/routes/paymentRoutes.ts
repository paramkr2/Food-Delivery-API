// fetch 10 nearby resturant and dishes 
import Router  from 'express';
import {create,confirm,handleWebhookEvent} from '../controller/payment'
import authMiddleware from "../middleware/authMiddleware";
const router = Router();

router.post('/create' , create) // find nearby resturants and return . upto a certain distance . 
router.post('/confirm',confirm)
router.post('/webhook',handleWebhookEvent)
export default router; 
