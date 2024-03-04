import {login,signup} from '../controller/auth' ;
import {Router} from 'express'

const router = Router()
router.post('/login',login);
router.post('/signup',signup);

export default router ;