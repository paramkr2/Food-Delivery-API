import {login,signup} from '../controller/auth' ;
import {Router} from 'express'

const router = Router()

console.log('in auth Routes')
router.post('/login',login);
router.post('/signup',signup);

export default router ;