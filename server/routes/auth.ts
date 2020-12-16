import { Router } from 'express';
import { createOrUpdateUser, currentUser } from '../controllers/authController';
import { authCheack, adminCheck } from '../middleware/authMiddleware';

const authRouter = Router();

authRouter.post('/create-or-update-user', authCheack, createOrUpdateUser);
authRouter.post('/current-user', authCheack, currentUser);
authRouter.post('/current-admin', authCheack, adminCheck, currentUser);

// module.exports = router;
export default authRouter;
