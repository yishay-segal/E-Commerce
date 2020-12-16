"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controllers
const productController_1 = require("../controllers/productController");
// middleware
const authMiddleware_1 = require("../middleware/authMiddleware");
// routes
const router = express_1.Router();
router.post('/product', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, productController_1.create);
router.get('/products/total', productController_1.productsCount);
router.get('/products/:count', productController_1.listAll);
router.delete('/product/:slug', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, productController_1.remove);
router.get('/product/:slug', productController_1.read);
router.put('/product/:slug', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, productController_1.update);
router.post('/products', productController_1.list);
// rating
router.put('/product/star/:productId', authMiddleware_1.authCheack, productController_1.productStar);
//related
router.get('/product/related/:productId', productController_1.listRelated);
// search
router.post('/search/filters', productController_1.searchFilters);
// module.exports = router;
exports.default = router;
