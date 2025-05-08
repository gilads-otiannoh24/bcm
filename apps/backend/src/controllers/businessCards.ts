import type { Request, Response, NextFunction } from "express";
import { BusinessCard } from "../models/BusinessCard";
import { Activity } from "../models/Activity";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import { AuthenticatedRequest } from "../middleware/auth";
import { AdvancedResultsResponse } from "../middleware/advancedResults";
import { logInfo } from "../utils/logger";
import { User } from "../models/User";

interface BusinessCardRequestBody {
  title: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  template?: string;
  color?: string;
  status?: string;
  owner?: string;
  organization?: string;
}

interface AdvancedResults extends Response {
  advancedResults: {
    success: boolean;
    count: number;
  };
}

// @desc    Get all business cards
// @route   GET /api/v1/businesscards
// @access  Private/Admin
export const getCards = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: AdvancedResultsResponse,
    next: NextFunction
  ) => {
    res.status(200).json(res.advancedResults); //
  }
);

// @desc    Get single business card
// @route   GET /api/v1/businesscards/:id
// @access  Private
export const getCard = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const card = await BusinessCard.findById(req.params.id).populate({
      path: "owner",
      select: "firstName lastName email avatar",
    });

    if (!card) {
      return next(
        new ErrorResponse(
          `Business card not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: card,
    });
  }
);

// @desc    Get business cards for current user
// @route   GET /api/v1/businesscards/me
// @access  Private
export const getMyCards = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const cards = await BusinessCard.find({ owner: req.user!.id });

    res.status(200).json({
      success: true,
      count: cards.length,
      data: cards,
    });
  }
);

// @desc    Create new business card
// @route   POST /api/v1/businesscards
// @access  Private
export const createCard = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Add user to req.body
    req.body.owner = req.body.userId || req.user!.id;

    // Check if user has organization
    if (req.user!.organization) {
      req.body.organization = req.user!.organization.toString();
    }

    const card = await BusinessCard.create(req.body);

    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "card_created",
      details: `Created business card: ${card.title} ${
        req.body.userId
          ? `for user ${(await User.findById(req.body.userId))?.firstName}`
          : ""
      }`,
      relatedCard: card._id,
    });

    logInfo(`Business card created: ${card._id} by user ${req.user!.id}`);

    res.status(201).json({
      success: true,
      data: card,
    });
  }
);

// @desc    Update business card
// @route   PUT /api/v1/businesscards/:id
// @access  Private
export const updateCard = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let card = await BusinessCard.findById(req.params.id);

    if (!card) {
      return next(
        new ErrorResponse(
          `Business card not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user is card owner or admin
    if (card.owner.toString() !== req.user!.id && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to update this card`,
          401
        )
      );
    }

    card = await BusinessCard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "card_updated",
      details: `Updated business card: ${card!.title}`,
      relatedCard: card!._id,
    });
    logInfo(`Business card updated: ${card!.id} by user ${req.user!.id}`);

    res.status(200).json({
      success: true,
      data: card,
    });
  }
);

// @desc    Delete business card
// @route   DELETE /api/v1/businesscards/:id
// @access  Private
export const deleteCard = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const card = await BusinessCard.findById(req.params.id);

    if (!card) {
      return next(
        new ErrorResponse(
          `Business card not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user is card owner or admin
    if (card.owner.toString() !== req.user!.id && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to delete this card`,
          401
        )
      );
    }

    await card.deleteOne();

    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "card_deleted",
      details: `Deleted business card: ${card.title}`,
      relatedCard: card._id,
    });

    logInfo(`Business card deleted: ${card.id} by user ${req.user!.id}`);

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @desc    Delete bulk business card
// @route   POST /api/v1/businesscards/deletebulk
// @access  Private
export const deleteBulkCards = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const ids = req.body.ids;

    const deletedCards = await BusinessCard.deleteMany({
      _id: { $in: ids },
    });
    const deletedCount = deletedCards.deletedCount;

    logInfo(`Deleted ${deletedCount} business cards by user ${req.user?.id}`);
    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @desc    Share business card
// @route   POST /api/v1/businesscards/:id/share
// @access  Private
export const shareCard = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const card = await BusinessCard.findById(req.params.id);

    if (!card) {
      return next(
        new ErrorResponse(
          `Business card not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user is card owner or admin
    if (card.owner.id !== req.user!.id && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to share this card`,
          401
        )
      );
    }

    // Increment shares count
    card.shares += 1;
    await card.save();

    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "card_shared",
      details: `Shared business card: ${card.title}`,
      relatedCard: card._id,
    });

    logInfo(`Business card shared: ${card.id} by user ${req.user!.id}`);

    res.status(200).json({
      success: true,
      data: {
        shareableLink: card.shareableLink,
      },
    });
  }
);

// @desc    Get business card by shareable link
// @route   GET /api/v1/businesscards/share/:shareableLink
// @access  Public
export const getCardByShareableLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const card = await BusinessCard.findOne({
      _id: req.params.shareableLink,
      status: "active",
    }).populate({
      path: "owner",
      select: "firstName lastName email avatar",
    });

    if (!card) {
      return next(
        new ErrorResponse(`Business card not found with this link`, 404)
      );
    }

    // Increment views count
    card.views += 1;
    await card.save();
    // Create activity log
    await Activity.create({
      user: card.owner.id,
      type: "card_viewed",
      details: `Viewed business card: ${card.title}`,
      relatedCard: card._id,
    });
    logInfo(`Business card viewed: ${card.id} by user ${card.owner.id}`);

    res.status(200).json({
      success: true,
      data: card,
    });
  }
);

// @desc    Duplicate business card
// @route   POST /api/v1/businesscards/:id/duplicate
// @access  Private
export const duplicateCard = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const card = await BusinessCard.findById(req.params.id);

    if (!card) {
      return next(
        new ErrorResponse(
          `Business card not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user is card owner or admin
    if (card.owner.id !== req.user!.id && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to duplicate this card`,
          401
        )
      );
    }

    // Create a new card with the same data
    const newCard = await BusinessCard.create({
      title: `Copy of ${card.title}`,
      name: card.name,
      jobTitle: card.jobTitle,
      company: card.company,
      email: card.email,
      phone: card.phone,
      website: card.website,
      address: card.address,
      template: card.template,
      color: card.color,
      status: "draft",
      owner: req.user!.id,
      organization: card.organization,
    });

    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "card_created",
      details: `Duplicated business card: ${card.title}`,
      relatedCard: newCard._id,
    });
    logInfo(`Business card duplicated: ${newCard.id} by user ${req.user!.id}`);

    res.status(201).json({
      success: true,
      data: newCard,
    });
  }
);

// @desc    Get business card stats
// @route   GET /api/v1/businesscards/:id/stats
// @access  Private
export const getCardStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const card = await BusinessCard.findById(req.params.id);

    if (!card) {
      return next(
        new ErrorResponse(
          `Business card not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user is card owner or admin
    if (card.owner.toString() !== req.user!.id && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to view stats for this card`,
          401
        )
      );
    }

    // Get activities related to this card
    const activities = await Activity.find({
      relatedCard: card._id,
      type: { $in: ["card_shared", "card_collected"] },
    })
      .sort("-createdAt")
      .limit(10);

    logInfo(`Business card stats viewed: ${card.id} by user ${req.user!.id}`);

    res.status(200).json({
      success: true,
      data: {
        views: card.views,
        shares: card.shares,
        recentActivities: activities,
      },
    });
  }
);
