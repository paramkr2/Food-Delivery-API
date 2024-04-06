import {getLocation} from '../controller/driver'
import authMiddleware from "../middleware/authMiddleware";
import {Router} from 'express';


const router = Router();
router.get('/location/:driverId',authMiddleware,getLocation )
export default router;