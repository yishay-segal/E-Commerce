"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCheck = exports.authCheack = void 0;
const firebase_1 = __importDefault(require("../firebase"));
const userModel_1 = __importDefault(require("../models/userModel"));
exports.authCheack = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.headers);
    try {
        const authtoken = req.headers.authtoken;
        const firebaseUser = yield firebase_1.default.auth().verifyIdToken(authtoken);
        // console.log('firebase user in authcheck', firebaseUser);
        req.user = firebaseUser;
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            err: 'Invalid or expired token',
        });
    }
    next();
});
exports.adminCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const adminUser = yield userModel_1.default.findOne({ email }).exec();
    if ((adminUser === null || adminUser === void 0 ? void 0 : adminUser.role) !== 'admin') {
        res.status(403).json({
            err: 'Admin resource. Access deined',
        });
    }
    else {
        next();
    }
});
