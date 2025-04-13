"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationCards = exports.removeOrganizationMember = exports.addOrganizationMember = exports.getOrganizationMembers = exports.deleteOrganization = exports.updateOrganization = exports.createOrganization = exports.getOrganization = exports.getOrganizations = void 0;
const Organization_1 = require("../models/Organization");
const User_1 = require("../models/User");
const BusinessCard_1 = require("../models/BusinessCard");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
const logger_1 = require("../utils/logger");
const Activity_1 = require("../models/Activity");
// @desc    Get all organizations
// @route   GET /api/v1/organizations
// @access  Private/Admin
exports.getOrganizations = (0, async_1.default)(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});
// @desc    Get single organization
// @route   GET /api/v1/organizations/:id
// @access  Private
exports.getOrganization = (0, async_1.default)(async (req, res, next) => {
    const organization = await Organization_1.Organization.findById(req.params.id);
    if (!organization) {
        return next(new errorResponse_1.default(`Organization not found with id of ${req.params.id}`, 404));
    }
    // Check if user is part of organization or admin
    const isAdmin = req.user.role === "admin";
    const isOwner = organization.owner.toString() === req.user.id;
    const isAdmin2 = organization.admins.some((admin) => admin.toString() === req.user.id);
    const isMember = req.user.organization &&
        req.user.organization.toString() === organization._id.toString();
    if (!isAdmin && !isOwner && !isAdmin2 && !isMember) {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to access this organization`, 401));
    }
    res.status(200).json({
        success: true,
        data: organization,
    });
});
// @desc    Create new organization
// @route   POST /api/v1/organizations
// @access  Private
exports.createOrganization = (0, async_1.default)(async (req, res, next) => {
    // Add user to req.body as owner
    req.body.owner = req.user.id;
    // Check if user already has an organization
    const existingOrg = await Organization_1.Organization.findOne({ owner: req.user.id });
    // If user is not an admin, they can only create one organization
    if (existingOrg && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} already has an organization`, 400));
    }
    const organization = await Organization_1.Organization.create(req.body);
    // Update user's organization field
    await User_1.User.findByIdAndUpdate(req.user.id, {
        organization: organization._id,
    });
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "organization_created",
        details: `Created organization ${organization.name}`,
        relatedOrganization: organization._id,
    });
    (0, logger_1.logInfo)(`Created organization ${organization.name} for user ${req.user.id}`);
    res.status(201).json({
        success: true,
        data: organization,
    });
});
// @desc    Update organization
// @route   PUT /api/v1/organizations/:id
// @access  Private
exports.updateOrganization = (0, async_1.default)(async (req, res, next) => {
    let organization = await Organization_1.Organization.findById(req.params.id);
    if (!organization) {
        return next(new errorResponse_1.default(`Organization not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is organization owner or admin
    if (organization.owner.id !== req.user.id && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to update this organization`, 401));
    }
    organization = await Organization_1.Organization.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "organization_updated",
        details: `Updated organization ${organization.name}`,
        relatedOrganization: organization._id,
    });
    (0, logger_1.logInfo)(`Updated organization ${organization.name} for user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: organization,
    });
});
// @desc    Delete organization
// @route   DELETE /api/v1/organizations/:id
// @access  Private
exports.deleteOrganization = (0, async_1.default)(async (req, res, next) => {
    const organization = await Organization_1.Organization.findById(req.params.id);
    if (!organization) {
        return next(new errorResponse_1.default(`Organization not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is organization owner or admin
    if (organization.owner.toString() !== req.user.id &&
        req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to delete this organization`, 401));
    }
    // Remove organization from all users
    await User_1.User.updateMany({ organization: organization._id }, { $unset: { organization: "" } });
    await organization.deleteOne();
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "organization_deleted",
        details: `Deleted organization ${organization.name}`,
        relatedOrganization: organization._id,
    });
    (0, logger_1.logInfo)(`Deleted organization ${organization.name} by user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Get organization members
// @route   GET /api/v1/organizations/:id/members
// @access  Private
exports.getOrganizationMembers = (0, async_1.default)(async (req, res, next) => {
    const organization = await Organization_1.Organization.findById(req.params.id);
    if (!organization) {
        return next(new errorResponse_1.default(`Organization not found with id of ${req.params.id}`, 404));
    }
    // Check if user is part of organization or admin
    const isAdmin = req.user.role === "admin";
    const isOwner = organization.owner.toString() === req.user.id;
    const isOrgAdmin = organization.admins.some((admin) => admin.toString() === req.user.id);
    const isMember = req.user.organization &&
        req.user.organization.toString() === organization._id.toString();
    if (!isAdmin && !isOwner && !isOrgAdmin && !isMember) {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to access this organization's members`, 401));
    }
    const members = await User_1.User.find({ organization: organization._id });
    res.status(200).json({
        success: true,
        count: members.length,
        data: members,
    });
});
// @desc    Add organization member
// @route   POST /api/v1/organizations/:id/members
// @access  Private/Admin
exports.addOrganizationMember = (0, async_1.default)(async (req, res, next) => {
    const organization = await Organization_1.Organization.findById(req.params.id);
    if (!organization) {
        return next(new errorResponse_1.default(`Organization not found with id of ${req.params.id}`, 404));
    }
    const user = await User_1.User.findById(req.body.userId);
    if (!user) {
        return next(new errorResponse_1.default(`User not found with id of ${req.body.userId}`, 404));
    }
    // Update user's organization
    user.organization = organization._id;
    await user.save();
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "organization_member_added",
        details: `Added user ${user.firstName} ${user.lastName} to organization ${organization.name}`,
        relatedOrganization: organization._id,
    });
    (0, logger_1.logInfo)(`Added user ${user.firstName} ${user.lastName} to organization ${organization.name} by user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: user,
    });
});
// @desc    Remove organization member
// @route   DELETE /api/v1/organizations/:id/members/:userId
// @access  Private/Admin
exports.removeOrganizationMember = (0, async_1.default)(async (req, res, next) => {
    const organization = await Organization_1.Organization.findById(req.params.id);
    if (!organization) {
        return next(new errorResponse_1.default(`Organization not found with id of ${req.params.id}`, 404));
    }
    const user = await User_1.User.findById(req.params.userId);
    if (!user) {
        return next(new errorResponse_1.default(`User not found with id of ${req.params.userId}`, 404));
    }
    // Check if user is part of the organization
    if (!user.organization ||
        user.organization.toString() !== organization._id.toString()) {
        return next(new errorResponse_1.default(`User ${req.params.userId} is not a member of this organization`, 400));
    }
    // Cannot remove the owner
    if (organization.owner.toString() === user._id.toString()) {
        return next(new errorResponse_1.default(`Cannot remove the owner from the organization`, 400));
    }
    // Remove user from organization
    user.organization = undefined;
    await user.save();
    // If user is an admin, remove from admins array
    if (organization.admins.includes(user._id)) {
        organization.admins = organization.admins.filter((admin) => admin.toString() !== user._id.toString());
        await organization.save();
    }
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "organization_member_removed",
        details: `Removed user ${user.firstName} ${user.lastName} from organization ${organization.name}`,
        relatedOrganization: organization._id,
    });
    (0, logger_1.logInfo)(`Removed user ${user.firstName} ${user.lastName} from organization ${organization.name} by user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Get organization cards
// @route   GET /api/v1/organizations/:id/cards
// @access  Private
exports.getOrganizationCards = (0, async_1.default)(async (req, res, next) => {
    const organization = await Organization_1.Organization.findById(req.params.id);
    if (!organization) {
        return next(new errorResponse_1.default(`Organization not found with id of ${req.params.id}`, 404));
    }
    // Check if user is part of organization or admin
    const isAdmin = req.user.role === "admin";
    const isOwner = organization.owner.toString() === req.user.id;
    const isOrgAdmin = organization.admins.some((admin) => admin.toString() === req.user.id);
    const isMember = req.user.organization &&
        req.user.organization.toString() === organization._id.toString();
    if (!isAdmin && !isOwner && !isOrgAdmin && !isMember) {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to access this organization's cards`, 401));
    }
    const cards = await BusinessCard_1.BusinessCard.find({
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
});
