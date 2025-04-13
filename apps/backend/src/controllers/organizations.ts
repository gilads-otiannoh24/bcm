import type { Request, Response, NextFunction } from "express";
import { Organization } from "../models/Organization";
import { User } from "../models/User";
import { BusinessCard } from "../models/BusinessCard";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import { AdvancedResultsResponse } from "../middleware/advancedResults";
import { AuthenticatedRequest } from "../middleware/auth";
import { logInfo } from "../utils/logger";
import { Activity } from "../models/Activity";

interface OrganizationRequestBody {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  status?: "active" | "inactive";
  owner?: string;
  admins?: string[];
}

// @desc    Get all organizations
// @route   GET /api/v1/organizations
// @access  Private/Admin
export const getOrganizations = asyncHandler(
  async (req: Request, res: AdvancedResultsResponse, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get single organization
// @route   GET /api/v1/organizations/:id
// @access  Private
export const getOrganization = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(
        new ErrorResponse(
          `Organization not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Check if user is part of organization or admin
    const isAdmin = req.user!.role === "admin";
    const isOwner = organization.owner.toString() === req.user!.id;
    const isAdmin2 = organization.admins.some(
      (admin) => admin.toString() === req.user!.id
    );
    const isMember =
      req.user!.organization &&
      req.user!.organization.toString() === organization._id.toString();

    if (!isAdmin && !isOwner && !isAdmin2 && !isMember) {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to access this organization`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  }
);

// @desc    Create new organization
// @route   POST /api/v1/organizations
// @access  Private
export const createOrganization = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Add user to req.body as owner
    req.body.owner = req.user!.id;

    // Check if user already has an organization
    const existingOrg = await Organization.findOne({ owner: req.user!.id });

    // If user is not an admin, they can only create one organization
    if (existingOrg && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} already has an organization`,
          400
        )
      );
    }

    const organization = await Organization.create(req.body);

    // Update user's organization field
    await User.findByIdAndUpdate(req.user!.id, {
      organization: organization._id,
    });
    // create activity log
    await Activity.create({
      user: req.user!.id,
      type: "organization_created",
      details: `Created organization ${organization.name}`,
      relatedOrganization: organization._id,
    });
    logInfo(
      `Created organization ${organization.name} for user ${req.user!.id}`
    );

    res.status(201).json({
      success: true,
      data: organization,
    });
  }
);

// @desc    Update organization
// @route   PUT /api/v1/organizations/:id
// @access  Private
export const updateOrganization = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(
        new ErrorResponse(
          `Organization not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user is organization owner or admin
    if (organization.owner.id !== req.user!.id && req.user!.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to update this organization`,
          401
        )
      );
    }

    organization = await Organization.findByIdAndUpdate(
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
      type: "organization_updated",
      details: `Updated organization ${organization!.name}`,
      relatedOrganization: organization!._id,
    });
    logInfo(
      `Updated organization ${organization!.name} for user ${req.user!.id}`
    );

    res.status(200).json({
      success: true,
      data: organization,
    });
  }
);

// @desc    Delete organization
// @route   DELETE /api/v1/organizations/:id
// @access  Private
export const deleteOrganization = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(
        new ErrorResponse(
          `Organization not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user is organization owner or admin
    if (
      organization.owner.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to delete this organization`,
          401
        )
      );
    }

    // Remove organization from all users
    await User.updateMany(
      { organization: organization._id },
      { $unset: { organization: "" } }
    );

    await organization.deleteOne();

    // create activity log
    await Activity.create({
      user: req.user!.id,
      type: "organization_deleted",
      details: `Deleted organization ${organization.name}`,
      relatedOrganization: organization._id,
    });
    logInfo(
      `Deleted organization ${organization.name} by user ${req.user!.id}`
    );

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @desc    Get organization members
// @route   GET /api/v1/organizations/:id/members
// @access  Private
export const getOrganizationMembers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(
        new ErrorResponse(
          `Organization not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Check if user is part of organization or admin
    const isAdmin = req.user!.role === "admin";
    const isOwner = organization.owner.toString() === req.user!.id;
    const isOrgAdmin = organization.admins.some(
      (admin) => admin.toString() === req.user!.id
    );
    const isMember =
      req.user!.organization &&
      req.user!.organization.toString() === organization._id.toString();

    if (!isAdmin && !isOwner && !isOrgAdmin && !isMember) {
      return next(
        new ErrorResponse(
          `User ${
            req.user!.id
          } is not authorized to access this organization's members`,
          401
        )
      );
    }

    const members = await User.find({ organization: organization._id });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  }
);

// @desc    Add organization member
// @route   POST /api/v1/organizations/:id/members
// @access  Private/Admin
export const addOrganizationMember = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(
        new ErrorResponse(
          `Organization not found with id of ${req.params.id}`,
          404
        )
      );
    }

    const user = await User.findById(req.body.userId);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.body.userId}`, 404)
      );
    }

    // Update user's organization
    user.organization = organization._id;
    await user.save();

    // create activity log
    await Activity.create({
      user: req.user!.id,
      type: "organization_member_added",
      details: `Added user ${user.firstName} ${user.lastName} to organization ${organization.name}`,
      relatedOrganization: organization._id,
    });
    logInfo(
      `Added user ${user.firstName} ${user.lastName} to organization ${
        organization.name
      } by user ${req.user!.id}`
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @desc    Remove organization member
// @route   DELETE /api/v1/organizations/:id/members/:userId
// @access  Private/Admin
export const removeOrganizationMember = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(
        new ErrorResponse(
          `Organization not found with id of ${req.params.id}`,
          404
        )
      );
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
      );
    }

    // Check if user is part of the organization
    if (
      !user.organization ||
      user.organization.toString() !== organization._id.toString()
    ) {
      return next(
        new ErrorResponse(
          `User ${req.params.userId} is not a member of this organization`,
          400
        )
      );
    }

    // Cannot remove the owner
    if (organization.owner.toString() === user._id.toString()) {
      return next(
        new ErrorResponse(`Cannot remove the owner from the organization`, 400)
      );
    }

    // Remove user from organization
    user.organization = undefined;
    await user.save();

    // If user is an admin, remove from admins array
    if (organization.admins.includes(user._id)) {
      organization.admins = organization.admins.filter(
        (admin) => admin.toString() !== user._id.toString()
      );
      await organization.save();
    }

    // create activity log
    await Activity.create({
      user: req.user!.id,
      type: "organization_member_removed",
      details: `Removed user ${user.firstName} ${user.lastName} from organization ${organization.name}`,
      relatedOrganization: organization._id,
    });
    logInfo(
      `Removed user ${user.firstName} ${user.lastName} from organization ${
        organization.name
      } by user ${req.user!.id}`
    );

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @desc    Get organization cards
// @route   GET /api/v1/organizations/:id/cards
// @access  Private
export const getOrganizationCards = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(
        new ErrorResponse(
          `Organization not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Check if user is part of organization or admin
    const isAdmin = req.user!.role === "admin";
    const isOwner = organization.owner.toString() === req.user!.id;
    const isOrgAdmin = organization.admins.some(
      (admin) => admin.toString() === req.user!.id
    );
    const isMember =
      req.user!.organization &&
      req.user!.organization.toString() === organization._id.toString();

    if (!isAdmin && !isOwner && !isOrgAdmin && !isMember) {
      return next(
        new ErrorResponse(
          `User ${
            req.user!.id
          } is not authorized to access this organization's cards`,
          401
        )
      );
    }

    const cards = await BusinessCard.find({
      organization: organization._id,
    }).populate({
      path: "owner",
      select: "firstName lastName email avatar",
    });

    res.status(200).json({
      success: true,
      count: cards.length,
      data: cards,
    });
  }
);
