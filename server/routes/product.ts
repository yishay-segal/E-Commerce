import { Router } from 'express';
// controllers
import {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
} from '../controllers/productController';
// middleware
import { authCheack, adminCheck } from '../middleware/authMiddleware';

// routes
const router = Router();
router.post('/product', authCheack, adminCheck, create);
router.get('/products/total', productsCount);

router.get('/products/:count', listAll);
router.delete('/product/:slug', authCheack, adminCheck, remove);
router.get('/product/:slug', read);
router.put('/product/:slug', authCheack, adminCheck, update);

router.post('/products', list);
// rating
router.put('/product/star/:productId', authCheack, productStar);
//related
router.get('/product/related/:productId', listRelated);
// search
router.post('/search/filters', searchFilters);

// module.exports = router;
export default router;
