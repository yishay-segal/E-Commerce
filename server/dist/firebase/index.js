"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// const serviceAccount = require('../config/serviceAccountKey');
const serviceAccountKey_json_1 = __importDefault(require("../config/serviceAccountKey.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountKey_json_1.default),
    databaseURL: 'https://ecommerce-a7062.firebaseio.com',
});
exports.default = firebase_admin_1.default;
