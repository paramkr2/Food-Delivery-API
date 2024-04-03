import { addressUpdate, getUser, updateUser } from '../controller/user';
import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Route to update location and address
router.post('/address', authMiddleware, addressUpdate);

// Route to get user by ID
router.get('/get', authMiddleware, getUser);

// Route to update user other than address
router.post('/update', authMiddleware, updateUser);

export default router;
