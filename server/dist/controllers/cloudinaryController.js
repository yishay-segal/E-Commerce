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
exports.remove = exports.upload = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinary = cloudinary_1.default.v2;
//config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield cloudinary.uploader.upload(req.body.image, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
    });
    res.json({
        public_id: result.public_id,
        url: result.secure_url,
    });
});
exports.remove = (req, res) => {
    let image_id = req.body.public_id;
    cloudinary.uploader.destroy(image_id, (err, result) => {
        if (err)
            return res.json({ success: false, err });
        res.send('ok');
    });
};
