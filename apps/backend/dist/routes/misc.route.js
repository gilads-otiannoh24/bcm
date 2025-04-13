"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const BusinessCard_1 = require("../models/BusinessCard");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.use(auth_1.protect);
// protected routes
router
    .route("/admindashboardstats")
    .get((0, auth_1.authorize)("admin"), async (req, res) => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const totalUsers = await User_1.User.find({}).count();
    // this montsh users and last months users and compareand give percentage
    const thisMonthUsers = await User_1.User.find({
        createdAt: {
            $gte: thisMonthStart,
            $lt: nextMonthStart,
        },
    }).count();
    const lastMonthUsers = await User_1.User.find({
        createdAt: {
            $gte: lastMonthStart,
            $lt: thisMonthStart,
        },
    }).count();
    // calculate percentage change positive or negative
    const usersPercentageChange = ((thisMonthUsers - lastMonthUsers) /
        (lastMonthUsers === 0 ? 1 : lastMonthUsers)) *
        100;
    const totalCards = await BusinessCard_1.BusinessCard.find({}).count();
    const thisMonthCards = await BusinessCard_1.BusinessCard.countDocuments({
        createdAt: {
            $gte: thisMonthStart,
            $lt: nextMonthStart,
        },
    });
    const lastMonthCards = await BusinessCard_1.BusinessCard.countDocuments({
        createdAt: {
            $gte: lastMonthStart,
            $lt: thisMonthStart, // upper limit is start of this month
        },
    });
    // calculate percentage change positive or negative
    const cardsPercentageChange = ((thisMonthCards - lastMonthCards) /
        (lastMonthCards === 0 ? 1 : lastMonthCards)) *
        100;
    res.status(200).json({
        success: true,
        data: {
            totalUsers,
            usersPercentageChange,
            totalCards,
            cardsPercentageChange,
        },
    });
});
exports.default = router;
