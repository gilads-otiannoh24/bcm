"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectConnection = exports.acceptConnection = exports.deleteConnection = exports.updateConnection = exports.createConnection = exports.getConnection = exports.getConnections = void 0;
const Connection_1 = require("../models/Connection");
const BusinessCard_1 = require("../models/BusinessCard");
const User_1 = require("../models/User");
const Activity_1 = require("../models/Activity");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
const logger_1 = require("../utils/logger");
// @desc    Get all connections for current user
// @route   GET /api/v1/connections
// @access  Private
exports.getConnections = (0, async_1.default)(async (req, res, next) => {
    const connections = await Connection_1.Connection.find({ user: req.user.id })
        .populate({
        path: "contact",
        select: "firstName lastName email avatar",
    })
        .populate({
        path: "card",
        select: "title name jobTitle company email phone template color",
    });
    res.status(200).json({
        success: true,
        count: connections.length,
        data: connections,
    });
});
// @desc    Get single connection
// @route   GET /api/v1/connections/:id
// @access  Private
exports.getConnection = (0, async_1.default)(async (req, res, next) => {
    const connection = await Connection_1.Connection.findById(req.params.id)
        .populate({
        path: "contact",
        select: "firstName lastName email avatar",
    })
        .populate({
        path: "card",
        select: "title name jobTitle company email phone template color",
    });
    if (!connection) {
        return next(new errorResponse_1.default(`Connection not found with id of ${req.params.id}`, 404));
    }
    // Make sure user owns connection
    if (connection.user.toString() !== req.user.id &&
        req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to access this connection`, 401));
    }
    res.status(200).json({
        success: true,
        data: connection,
    });
});
// @desc    Create new connection
// @route   POST /api/v1/connections
// @access  Private
exports.createConnection = (0, async_1.default)(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;
    // Check if card exists
    const card = await BusinessCard_1.BusinessCard.findById(req.body.card);
    if (!card) {
        return next(new errorResponse_1.default(`Business card not found with id of ${req.body.card}`, 404));
    }
    // If contact is provided, check if user exists
    if (req.body.contact) {
        const contactUser = await User_1.User.findById(req.body.contact);
        if (!contactUser) {
            return next(new errorResponse_1.default(`User not found with id of ${req.body.contact}`, 404));
        }
    }
    // Create connection
    const connection = await Connection_1.Connection.create(req.body);
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "connection_created",
        details: `Created a new ${req.body.type} connection`,
        relatedCard: req.body.card,
        relatedConnection: connection._id,
    });
    (0, logger_1.logInfo)(`Created a new ${req.body.type} connection for user ${req.user.id}`);
    res.status(201).json({
        success: true,
        data: connection,
    });
});
// @desc    Update connection
// @route   PUT /api/v1/connections/:id
// @access  Private
exports.updateConnection = (0, async_1.default)(async (req, res, next) => {
    let connection = await Connection_1.Connection.findById(req.params.id);
    if (!connection) {
        return next(new errorResponse_1.default(`Connection not found with id of ${req.params.id}`, 404));
    }
    // Make sure user owns connection
    if (connection.user.toString() !== req.user.id &&
        req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to update this connection`, 401));
    }
    // Update connection
    connection = await Connection_1.Connection.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "connection_updated",
        details: `Updated a ${connection.type} connection`,
        relatedCard: connection.card,
        relatedConnection: connection._id,
    });
    (0, logger_1.logInfo)(`Updated a ${connection.type} connection for user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: connection,
    });
});
// @desc    Delete connection
// @route   DELETE /api/v1/connections/:id
// @access  Private
exports.deleteConnection = (0, async_1.default)(async (req, res, next) => {
    const connection = await Connection_1.Connection.findById(req.params.id);
    if (!connection) {
        return next(new errorResponse_1.default(`Connection not found with id of ${req.params.id}`, 404));
    }
    // Make sure user owns connection
    if (connection.user.toString() !== req.user.id &&
        req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to delete this connection`, 401));
    }
    await connection.deleteOne();
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "connection_deleted",
        details: `Deleted a ${connection.type} connection`,
        relatedCard: connection.card,
        relatedConnection: connection._id,
    });
    (0, logger_1.logInfo)(`Deleted a ${connection.type} connection for user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Accept connection
// @route   PUT /api/v1/connections/:id/accept
// @access  Private
exports.acceptConnection = (0, async_1.default)(async (req, res, next) => {
    const connection = await Connection_1.Connection.findById(req.params.id);
    if (!connection) {
        return next(new errorResponse_1.default(`Connection not found with id of ${req.params.id}`, 404));
    }
    // Check if connection is pending
    if (connection.status !== "pending") {
        return next(new errorResponse_1.default(`Connection is already ${connection.status}`, 400));
    }
    // If it's a shared connection, the contact should be the one accepting
    if (connection.type === "shared" && connection.contact) {
        if (connection.contact.toString() !== req.user.id) {
            return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to accept this connection`, 401));
        }
    }
    // If it's a collected connection, the user should be the one accepting
    else if (connection.type === "collected") {
        if (connection.user.toString() !== req.user.id) {
            return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to accept this connection`, 401));
        }
    }
    // Update connection status
    connection.status = "accepted";
    await connection.save();
    res.status(200).json({
        success: true,
        data: connection,
    });
});
// @desc    Reject connection
// @route   PUT /api/v1/connections/:id/reject
// @access  Private
exports.rejectConnection = (0, async_1.default)(async (req, res, next) => {
    const connection = await Connection_1.Connection.findById(req.params.id);
    if (!connection) {
        return next(new errorResponse_1.default(`Connection not found with id of ${req.params.id}`, 404));
    }
    // Check if connection is pending
    if (connection.status !== "pending") {
        return next(new errorResponse_1.default(`Connection is already ${connection.status}`, 400));
    }
    // If it's a shared connection, the contact should be the one rejecting
    if (connection.type === "shared" && connection.contact) {
        if (connection.contact.toString() !== req.user.id) {
            return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to reject this connection`, 401));
        }
    }
    // If it's a collected connection, the user should be the one rejecting
    else if (connection.type === "collected") {
        if (connection.user.toString() !== req.user.id) {
            return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to reject this connection`, 401));
        }
    }
    // Update connection status
    connection.status = "rejected";
    await connection.save();
    res.status(200).json({
        success: true,
        data: connection,
    });
});
