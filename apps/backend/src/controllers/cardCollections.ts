import type { Request, Response, NextFunction } from "express";
import { CardCollection } from "../models/CardCollection";
import { BusinessCard } from "../models/BusinessCard";
import { Activity } from "../models/Activity";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import { AuthenticatedRequest } from "../middleware/auth";
import { logInfo } from "../utils/logger";

interface CardCollectionRequestBody {
  card: string;
  notes?: string;
  tags?: string[];
  favorite?: boolean;
}

// @desc    Get all collections for current user
// @route   GET /api/v1/collections
// @access  Private
export const getCollections = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collections = await CardCollection.find({
      user: req.user!.id,
    }).populate({
      path: "card",
      select: "title name jobTitle company email phone template color preview",
    });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  }
);

// @desc    Get single collection
// @route   GET /api/v1/collections/:id
// @access  Private
export const getCollection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collection = await CardCollection.findById(req.params.id).populate({
      path: "card",
      select:
        "title name jobTitle company email phone website address template color preview",
    });

    if (!collection) {
      return next(
        new ErrorResponse(
          `Collection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user owns collection
    if (
      collection.user.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to access this collection`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  }
);

// @desc    Create new collection
// @route   POST /api/v1/collections
// @access  Private
export const createCollection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Add user to req.body
    req.body.user = req.user!.id;

    // Check if card exists
    const card = await BusinessCard.findById(req.body.card);

    if (!card) {
      return next(
        new ErrorResponse(
          `Business card not found with id of ${req.body.card}`,
          404
        )
      );
    }

    // Check if user already has this card in collection
    const existingCollection = await CardCollection.findOne({
      user: req.user!.id,
      card: req.body.card,
    });

    if (existingCollection) {
      return next(
        new ErrorResponse(`You have already collected this card`, 400)
      );
    }

    // Create collection
    const collection = await CardCollection.create(req.body);

    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "card_collected",
      details: `Collected business card: ${card.title}`,
      relatedCard: card._id,
    });

    logInfo(`User ${req.user!.id} collected card ${card._id}`);

    // Increment card views
    card.views += 1;
    await card.save();

    res.status(201).json({
      success: true,
      data: collection,
    });
  }
);

// @desc    Update collection
// @route   PUT /api/v1/collections/:id
// @access  Private
export const updateCollection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let collection = await CardCollection.findById(req.params.id);

    if (!collection) {
      return next(
        new ErrorResponse(
          `Collection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user owns collection
    if (
      collection.user.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to update this collection`,
          401
        )
      );
    }

    // Update collection
    collection = await CardCollection.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // create activity log
    await Activity.create({
      user: req.user!.id,
      type: "collection_updated",
      details: `Updated collection with id ${req.params.id}`,
      relatedCard: collection!.card.id,
    });
    logInfo(`User ${req.user!.id} updated collection ${req.params.id}`);

    res.status(200).json({
      success: true,
      data: collection,
    });
  }
);

// @desc    Delete collection
// @route   DELETE /api/v1/collections/:id
// @access  Private
export const deleteCollection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collection = await CardCollection.findById(req.params.id);

    if (!collection) {
      return next(
        new ErrorResponse(
          `Collection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user owns collection
    if (
      collection.user.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to delete this collection`,
          401
        )
      );
    }

    await collection.deleteOne();

    // create activity log
    await Activity.create({
      user: req.user!.id,
      type: "collection_deleted",
      details: `Deleted collection with id ${req.params.id}`,
      relatedCard: collection.card.id,
    });
    logInfo(`User ${req.user!.id} deleted collection ${req.params.id}`);

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @desc    Toggle favorite status
// @route   PUT /api/v1/collections/:id/favorite
// @access  Private
export const toggleFavorite = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collection = await CardCollection.findById(req.params.id);

    if (!collection) {
      return next(
        new ErrorResponse(
          `Collection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user owns collection
    if (collection.user.id !== req.user!.id && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to update this collection`,
          401
        )
      );
    }

    // Toggle favorite status
    collection.favorite = !collection.favorite;
    await collection.save();

    res.status(200).json({
      success: true,
      data: collection,
    });
  }
);

// @desc    Add tag to collection
// @route   POST /api/v1/collections/:id/tags
// @access  Private
export const addTag = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collection = await CardCollection.findById(req.params.id);

    if (!collection) {
      return next(
        new ErrorResponse(
          `Collection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user owns collection
    if (collection.user.id !== req.user!.id && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to update this collection`,
          401
        )
      );
    }

    const newTags: string[] = req.body.tags; // expecting an array of tags in the request body
    if (!Array.isArray(newTags) || newTags.length === 0) {
      return next(new ErrorResponse("Please provide at least one tag", 400));
    }

    if (!collection.tags) {
      collection.tags = [];
    }

    const existingTags = collection.tags;
    const tagsToAdd = newTags.filter((tag) => !existingTags.includes(tag));
    const duplicateTags = newTags.filter((tag) => existingTags.includes(tag));

    // Add new unique tags
    collection.tags.push(...tagsToAdd);
    await collection.save();
    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "collection_updated",
      details: `Added tags to collection with id ${req.params.id}`,
      relatedCard: collection.card.id,
    });
    logInfo(`User ${req.user!.id} added tags to collection ${req.params.id}`);

    res.status(200).json({
      success: true,
      data: collection,
      message: `Tags added: ${tagsToAdd.join(", ")}`,
      duplicateTags:
        duplicateTags.length > 0
          ? `Duplicate tags: ${duplicateTags.join(", ")}`
          : undefined,
    });
  }
);

// @desc    Remove tag from collection
// @route   DELETE /api/v1/collections/:id/tags/:tag
// @access  Private
export const removeTag = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collection = await CardCollection.findById(req.params.id);

    if (!collection) {
      return next(
        new ErrorResponse(
          `Collection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user owns collection
    if (
      collection.user.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to update this collection`,
          401
        )
      );
    }

    // Check if tag exists
    if (!collection.tags || !collection.tags.includes(req.params.tag)) {
      return next(new ErrorResponse(`Tag ${req.params.tag} not found`, 404));
    }

    // Remove tag
    collection.tags = collection.tags.filter((tag) => tag !== req.params.tag);
    await collection.save();

    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "collection_updated",
      details: `Removed tag from collection with id ${req.params.id}`,
      relatedCard: collection.card.id,
    });
    logInfo(
      `User ${req.user!.id} removed tag from collection ${req.params.id}`
    );

    res.status(200).json({
      success: true,
      data: collection,
    });
  }
);
