import { Router } from 'express';
import { upload, remove } from '../controllers/cloudinaryController';

//middlewares
import { authCheack, adminCheck } from '../middleware/authMiddleware';

const router = Router();
router.post('/uploadimages', authCheack, adminCheck, upload);
router.post('/removeimage', authCheack, adminCheck, remove);

export default router;
