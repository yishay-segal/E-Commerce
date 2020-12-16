"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controllers
const subController_1 = require("../controllers/subController");
// middleware
const authMiddleware_1 = require("../middleware/authMiddleware");
// routes
const router = express_1.Router();
router.post('/sub', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, subController_1.create);
router.get('/subs', subController_1.list);
router.get('/sub/:slug', subController_1.read);
router.put('/sub/:slug', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, subController_1.update);
router.delete('/sub/:slug', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, subController_1.remove);
// module.exports = router;
exports.default = router;
