import { Router } from 'express';
// controllers
import {
  create,
  read,
  update,
  remove,
  list,
  getSubs,
} from '../controllers/categoryController';
// middleware
import { authCheack, adminCheck } from '../middleware/authMiddleware';

// routes
const router = Router();
router.post('/category', authCheack, adminCheck, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.put('/category/:slug', authCheack, adminCheck, update);
router.delete('/category/:slug', authCheack, adminCheck, remove);
router.get('/category/subs/:_id', getSubs);

// module.exports = router;
export default router;
