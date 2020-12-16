import { Router } from 'express';
// controllers
import {
  create,
  read,
  update,
  remove,
  list,
} from '../controllers/subController';
// middleware
import { authCheack, adminCheck } from '../middleware/authMiddleware';

// routes
const router = Router();
router.post('/sub', authCheack, adminCheck, create);
router.get('/subs', list);
router.get('/sub/:slug', read);
router.put('/sub/:slug', authCheack, adminCheck, update);
router.delete('/sub/:slug', authCheack, adminCheck, remove);

// module.exports = router;
export default router;
