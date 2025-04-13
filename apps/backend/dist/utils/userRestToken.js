"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restPasswordToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const restPasswordToken = async (user) => {
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    return resetToken;
};
exports.restPasswordToken = restPasswordToken;
