import express, { Request, Response } from "express";
import { authorize, protect } from "../middleware/auth";
import { BusinessCard } from "../models/BusinessCard";
import { User } from "../models/User";

const router = express.Router();

router.use(protect);

// protected routes
router
  .route("/admindashboardstats")
  .get(authorize("admin"), async (req: Request, res: Response) => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalUsers = await User.find({}).count();

    // this montsh users and last months users and compareand give percentage
    const thisMonthUsers = await User.find({
      createdAt: {
        $gte: thisMonthStart,
        $lt: nextMonthStart,
      },
    }).count();
    const lastMonthUsers = await User.find({
      createdAt: {
        $gte: lastMonthStart,
        $lt: thisMonthStart,
      },
    }).count();
    // calculate percentage change positive or negative
    const usersPercentageChange =
      ((thisMonthUsers - lastMonthUsers) /
        (lastMonthUsers === 0 ? 1 : lastMonthUsers)) *
      100;

    const totalCards = await BusinessCard.find({}).count();

    const thisMonthCards = await BusinessCard.countDocuments({
      createdAt: {
        $gte: thisMonthStart,
        $lt: nextMonthStart,
      },
    });

    const lastMonthCards = await BusinessCard.countDocuments({
      createdAt: {
        $gte: lastMonthStart,
        $lt: thisMonthStart, // upper limit is start of this month
      },
    });

    // calculate percentage change positive or negative
    const cardsPercentageChange =
      ((thisMonthCards - lastMonthCards) /
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
export default router;
