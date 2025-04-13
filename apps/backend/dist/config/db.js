"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const connectDB = async () => {
    const conn = await mongoose_1.default.connect(process.env.MONGO_URI);
    (0, logger_1.logInfo)(`MongoDB Connected: ${conn.connection.host}`);
};
exports.default = connectDB;
