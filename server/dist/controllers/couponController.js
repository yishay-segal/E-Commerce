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
exports.list = exports.remove = exports.create = void 0;
const couponModel_1 = __importDefault(require("../models/couponModel"));
// create remove list
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, expiry, discount } = req.body.coupon;
        res.json(yield new couponModel_1.default({ name, expiry, discount }).save());
    }
    catch (error) {
        console.error(error);
    }
});
exports.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield couponModel_1.default.findByIdAndDelete(req.params.couponId).exec());
    }
    catch (error) {
        console.error(error);
    }
});
exports.list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield couponModel_1.default.find({}).sort({ createdAt: -1 }).exec());
    }
    catch (error) {
        console.error(error);
    }
});
