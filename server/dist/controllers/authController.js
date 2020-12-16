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
exports.currentUser = exports.createOrUpdateUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
exports.createOrUpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, picture, email } = req.user;
    const user = yield userModel_1.default.findOneAndUpdate({ email }, { name: email === null || email === void 0 ? void 0 : email.split('@')[0], picture }, { new: true });
    if (user) {
        console.log('user updated', user);
        res.json(user);
    }
    else {
        const newUser = yield new userModel_1.default({
            email,
            name: email === null || email === void 0 ? void 0 : email.split('@')[0],
            picture,
        }).save();
        console.log('user created', newUser);
        res.json(newUser);
    }
});
exports.currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    userModel_1.default.findOne({ email: req.user.email }).exec((err, user) => {
        if (err)
            throw new Error(err.message);
        res.json(user);
    });
});
