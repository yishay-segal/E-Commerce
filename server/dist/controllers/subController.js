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
exports.remove = exports.update = exports.read = exports.list = exports.create = void 0;
const subModel_1 = __importDefault(require("../models/subModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const slugify_1 = __importDefault(require("slugify"));
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, parent } = req.body;
        const sub = yield new subModel_1.default({
            name,
            parent,
            slug: slugify_1.default(name).toLocaleLowerCase(),
        }).save();
        res.json(sub);
    }
    catch (error) {
        res.status(400).send('Create sub failed');
    }
});
exports.list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield subModel_1.default.find({}).sort({ createdAt: -1 }).exec());
});
exports.read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let sub = yield subModel_1.default.findOne({ slug: req.params.slug }).exec();
    const products = yield productModel_1.default.find({ subs: sub })
        .populate('category')
        .exec();
    res.json({
        sub,
        products,
    });
});
exports.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, parent } = req.body;
    try {
        const updated = yield subModel_1.default.findOneAndUpdate({ slug: req.params.slug }, { name, slug: slugify_1.default(name), parent }, { new: true });
        res.json(updated);
    }
    catch (error) {
        res.status(400).send('Update failed');
    }
});
exports.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield subModel_1.default.findOneAndDelete({ slug: req.params.slug });
        res.json({
            data: deleted,
            message: 'sub deleted',
        });
    }
    catch (error) {
        res.status(400).send('Delete failed');
    }
});
