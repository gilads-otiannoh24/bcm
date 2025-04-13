import { NextFunction, Response } from "express";
import advancedResults, {
  AdvancedResultsResponse,
} from "../middleware/advancedResults";
import asyncHandler from "../middleware/async";
import { AuthenticatedRequest } from "../middleware/auth";
import { Settings } from "../models/Settings";
import ErrorResponse from "../utils/errorResponse";
import { Activity } from "../models/Activity";
import { logInfo } from "../utils/logger";

type UpdateDetailsRequestBody = {
  theme?: "light" | "dark" | "system";
  language?: "en" | "es" | "fr";
  cardLayout?: "grid" | "list";
  cardTemplate?: "Professional" | "Minimal" | "Bold" | "Creative" | "Elegant";
  autoShareCardsWithConnections?: boolean;
  requireApprovalBeforeSharing?: boolean;
  showCardAnalytics?: boolean;
};

export const getSettings = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: AdvancedResultsResponse,
    next: NextFunction
  ) => {
    return res.advancedResults;
  }
);
export const getSetting = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const setting = await Settings.findById(req.params.id);
    if (!setting) {
      return next(
        new ErrorResponse(
          `Settings not found for user with id of ${req.params.id}`,
          404
        )
      );
    }

    if (req.user?.id !== setting.user && req.user?.role !== "admin") {
      return next(
        new ErrorResponse(`Not authorized to access this setting`, 401)
      );
    }

    return res.send({ success: true, data: setting });
  }
);
export const getUserSettings = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const setting = await Settings.findOne({ user: req.user?.id });
    if (!setting) {
      return next(
        new ErrorResponse(`Setting not found for user ${req.user?.id}`, 404)
      );
    }

    return res.send({ success: true, data: setting });
  }
);
export const updateUserSettings = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const fieldsToUpdate: UpdateDetailsRequestBody = {
      theme: req.body.theme,
      language: req.body.language,
      cardLayout: req.body.cardLayout,
      cardTemplate: req.body.cardTemplate,
      autoShareCardsWithConnections: req.body.autoShareCardsWithConnections,
      requireApprovalBeforeSharing: req.body.requireApprovalBeforeSharing,
      showCardAnalytics: req.body.showCardAnalytics,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) =>
        fieldsToUpdate[key as keyof UpdateDetailsRequestBody] === undefined &&
        delete fieldsToUpdate[key as keyof UpdateDetailsRequestBody]
    );

    const setting = await Settings.findOneAndUpdate(
      { user: req.user?.id },
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!setting) {
      return next(
        new ErrorResponse(`Setting not found for user ${req.user?.id}`, 404)
      );
    }

    // create activity log
    await Activity.create({
      user: req.user!._id,
      type: "user_updated",
      details: `User ${req.user!.firstName} ${
        req.user!.lastName
      } updated their details`,
      relatedUser: req.user!._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    logInfo(`User settings updated - ${req.user!._id}`, {
      userId: req.user!._id,
      userRole: req.user!.role,
    });

    return res.send({ success: true, data: setting });
  }
);
