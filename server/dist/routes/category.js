"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controllers
const categoryController_1 = require("../controllers/categoryController");
// middleware
const authMiddleware_1 = require("../middleware/authMiddleware");
// routes
const router = express_1.Router();
router.post('/category', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, categoryController_1.create);
router.get('/categories', categoryController_1.list);
router.get('/category/:slug', categoryController_1.read);
router.put('/category/:slug', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, categoryController_1.update);
router.delete('/category/:slug', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, categoryController_1.remove);
router.get('/category/subs/:_id', categoryController_1.getSubs);
// module.exports = router;
exports.default = router;
