import type { Request, Response, NextFunction } from "express";
import { Activity } from "../models/Activity";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import { AdvancedResultsResponse } from "../middleware/advancedResults";
import { AuthenticatedRequest } from "../middleware/auth";

// @desc    Get all activities
// @route   GET /api/v1/activities
// @access  Private/Admin
export const getActivities = asyncHandler(
  async (req: Request, res: AdvancedResultsResponse, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get single activity
// @route   GET /api/v1/activities/:id
// @access  Private
export const getActivity = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const activity = await Activity.findById(req.params.id)
      .populate({
        path: "user",
        select: "firstName lastName email avatar",
      })
      .populate({
        path: "relatedUser",
        select: "firstName lastName email avatar",
      })
      .populate({
        path: "relatedCard",
        select: "title name jobTitle company template color",
      });

    if (!activity) {
      return next(
        new ErrorResponse(`Activity not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is activity owner or admin
    if (activity.user.id !== req.user!.id && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to access this activity`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  }
);

// @desc    Get activities for current user
// @route   GET /api/v1/activities/me
// @access  Private
export const getUserActivities = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const activities = await Activity.find({ user: req.user!.id })
      .populate({
        path: "relatedUser",
        select: "firstName lastName email avatar",
      })
      .populate({
        path: "relatedCard",
        select: "title name jobTitle company template color",
      })
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  }
);
