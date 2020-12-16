"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinaryController_1 = require("../controllers/cloudinaryController");
//middlewares
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.Router();
router.post('/uploadimages', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, cloudinaryController_1.upload);
router.post('/removeimage', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, cloudinaryController_1.remove);
exports.default = router;
