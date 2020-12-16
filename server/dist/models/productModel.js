"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const { ObjectId } = mongoose_1.Schema.Types;
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        text: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
        text: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32,
    },
    category: {
        type: ObjectId,
        ref: 'Category',
    },
    subs: [
        {
            type: ObjectId,
            ref: 'Sub',
        },
    ],
    quantity: Number,
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
    },
    shipping: {
        type: String,
        enum: ['Yes', 'No'],
    },
    color: {
        type: String,
        enum: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    },
    brand: {
        type: String,
        enum: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
    },
    ratings: [
        {
            star: Number,
            postedBy: { type: ObjectId, ref: 'User' },
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model('Product', productSchema);
