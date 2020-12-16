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
exports.searchFilters = exports.listRelated = exports.productStar = exports.productsCount = exports.list = exports.update = exports.read = exports.remove = exports.listAll = exports.create = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const slugify_1 = __importDefault(require("slugify"));
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.slug = slugify_1.default(req.body.title);
        const newProduct = yield new productModel_1.default(req.body).save();
        res.json(newProduct);
    }
    catch (error) {
        console.log(error);
        // res.status(400).send('Create product failed');
        res.status(400).json({
            err: error.message,
        });
    }
});
exports.listAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let products = yield productModel_1.default.find({})
        .limit(parseInt(req.params.count))
        .populate('category')
        .populate('subs')
        .sort([['createdAt', 'desc']])
        .exec();
    res.json(products);
});
exports.remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield productModel_1.default.findOneAndRemove({
            slug: req.params.slug,
        }).exec();
        res.json(deleted);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send('Product delete failed');
    }
});
exports.read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findOne({ slug: req.params.slug })
        .populate('category')
        .populate('subs')
        .exec();
    res.json(product);
});
exports.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.title) {
            req.body.slug = slugify_1.default(req.body.title);
        }
        const updated = yield productModel_1.default.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true }).exec();
        res.json(updated);
    }
    catch (error) {
        console.log('PRODUCT UPDATE ERROR', error);
        res.status(400).json({
            err: error.message,
        });
    }
});
// without peg
// export const list = async (req: Request, res: Response) => {
//   try {
//     // createdAt/updatedAt, desc/asc, 3
//     const { sort, order, limit } = req.body as listIn;
//     const products = await Product.find({})
//       .populate('category')
//       .populate('subs')
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     res.json(products);
//   } catch (error) {
//     console.log(error);
//   }
// };
//with pagination
exports.list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // createdAt/updatedAt, desc/asc, 3
        const { sort, order, page } = req.body;
        const currentPage = page || 1;
        const perPage = 3;
        const products = yield productModel_1.default.find({})
            .skip((currentPage - 1) * perPage)
            .populate('category')
            .populate('subs')
            .sort([[sort, order]])
            .limit(perPage)
            .exec();
        res.json(products);
    }
    catch (error) {
        console.log(error);
    }
});
exports.productsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let total = yield productModel_1.default.find({}).estimatedDocumentCount().exec();
    res.json(total);
});
exports.productStar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findById(req.params.productId).exec();
    const user = yield userModel_1.default.findOne({ email: req.user.email }).exec();
    const { star } = req.body;
    // who is updating
    //check if currently logged in user have already added rating to this product?
    let existingRatingObject = product === null || product === void 0 ? void 0 : product.ratings.find(elem => elem.postedBy.toString() === (user === null || user === void 0 ? void 0 : user._id.toString()));
    // if user haven't left rating yet, push it
    if (!existingRatingObject) {
        const ratingAdded = yield productModel_1.default.findByIdAndUpdate(product === null || product === void 0 ? void 0 : product._id, {
            $push: { ratings: { star, postedBy: user === null || user === void 0 ? void 0 : user._id } },
        }, { new: true }).exec();
        console.log('ratingAdded', ratingAdded);
        res.json(ratingAdded);
    }
    else {
        // if user have already left rating, update it
        const ratingUpdated = yield productModel_1.default.updateOne({ ratings: { $elemMatch: existingRatingObject } }, { $set: { 'ratings.$.star': star } }, { new: true }).exec();
        console.log('ratingUpdated', ratingUpdated);
        res.json(ratingUpdated);
    }
});
exports.listRelated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findById(req.params.productId).exec();
    const related = yield productModel_1.default.find({
        _id: { $ne: product === null || product === void 0 ? void 0 : product._id },
        category: product === null || product === void 0 ? void 0 : product.category,
    })
        .limit(3)
        .populate('category')
        .populate('subs')
        .populate('postedBy')
        .exec();
    res.json(related);
});
const handleQuery = (req, res, query) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({ $text: { $search: query } })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
    res.json(products);
});
const handlePrice = (req, res, price) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let products = yield productModel_1.default.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec();
        res.json(products);
    }
    catch (error) {
        console.error(error);
    }
});
const handleCategory = (req, res, category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let products = yield productModel_1.default.find({ category })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec();
        res.json(products);
    }
    catch (error) {
        console.error(error);
    }
});
const handleStar = (req, res, stars) => {
    productModel_1.default.aggregate([
        {
            $project: {
                document: '$$ROOT',
                floorAverage: {
                    $floor: { $avg: '$ratings.star' },
                },
            },
        },
        {
            $match: { floorAverage: stars },
        },
    ])
        .limit(12)
        .exec((err, aggregates) => {
        if (err)
            console.error('aggregate error', err);
        productModel_1.default.find({ _id: aggregates })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec((err, products) => {
            if (err)
                console.error('product aggregate error', err);
            res.json(products);
        });
    });
};
const handleSub = (req, res, sub) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({ subs: sub })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
    res.json(products);
});
const handleShipping = (req, res, shipping) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({ shipping })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
    res.json(products);
});
const handleColor = (req, res, color) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({ color })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
    res.json(products);
});
const handleBrand = (req, res, brand) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({ brand })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
    res.json(products);
});
//serach/ filter
exports.searchFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, price, category, stars, sub, shipping, brand, color, } = req.body;
    if (query) {
        yield handleQuery(req, res, query);
    }
    // price [start, end]
    if (price) {
        console.log('price ---', price);
        yield handlePrice(req, res, price);
    }
    if (category) {
        console.log('category ---', category);
        yield handleCategory(req, res, category);
    }
    if (stars) {
        console.log('stars ---', stars);
        yield handleStar(req, res, stars);
    }
    if (sub) {
        console.log('sub---', sub);
        yield handleSub(req, res, sub);
    }
    if (shipping) {
        console.log('shipping --->', shipping);
        yield handleShipping(req, res, shipping);
    }
    if (color) {
        console.log('color --->', color);
        yield handleColor(req, res, color);
    }
    if (brand) {
        console.log('brand --->', brand);
        yield handleBrand(req, res, brand);
    }
});
