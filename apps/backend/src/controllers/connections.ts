import type { Request, Response, NextFunction } from "express";
import { Connection } from "../models/Connection";
import { BusinessCard } from "../models/BusinessCard";
import { User } from "../models/User";
import { Activity } from "../models/Activity";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import { AuthenticatedRequest } from "../middleware/auth";
import { logInfo } from "../utils/logger";

interface ConnectionRequestBody {
  contact?: string;
  externalContact?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    notes?: string;
  };
  card: string;
  type: "shared" | "collected";
  status?: "pending" | "accepted" | "rejected";
  notes?: string;
  tags?: string[];
}

// @desc    Get all connections for current user
// @route   GET /api/v1/connections
// @access  Private
export const getConnections = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const connections = await Connection.find({ user: req.user!.id })
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
  }
);

// @desc    Get single connection
// @route   GET /api/v1/connections/:id
// @access  Private
export const getConnection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const connection = await Connection.findById(req.params.id)
      .populate({
        path: "contact",
        select: "firstName lastName email avatar",
      })
      .populate({
        path: "card",
        select: "title name jobTitle company email phone template color",
      });

    if (!connection) {
      return next(
        new ErrorResponse(
          `Connection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user owns connection
    if (
      connection.user.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to access this connection`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: connection,
    });
  }
);

// @desc    Create new connection
// @route   POST /api/v1/connections
// @access  Private
export const createConnection = asyncHandler(
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

    // If contact is provided, check if user exists
    if (req.body.contact) {
      const contactUser = await User.findById(req.body.contact);

      if (!contactUser) {
        return next(
          new ErrorResponse(
            `User not found with id of ${req.body.contact}`,
            404
          )
        );
      }
    }

    // Create connection
    const connection = await Connection.create(req.body);

    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "connection_created",
      details: `Created a new ${req.body.type} connection`,
      relatedCard: req.body.card,
      relatedConnection: connection._id,
    });
    logInfo(
      `Created a new ${req.body.type} connection for user ${req.user!.id}`
    );

    res.status(201).json({
      success: true,
      data: connection,
    });
  }
);

// @desc    Update connection
// @route   PUT /api/v1/connections/:id
// @access  Private
export const updateConnection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let connection = await Connection.findById(req.params.id);

    if (!connection) {
      return next(
        new ErrorResponse(
          `Connection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user owns connection
    if (
      connection.user.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to update this connection`,
          401
        )
      );
    }

    // Update connection
    connection = await Connection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "connection_updated",
      details: `Updated a ${connection!.type} connection`,
      relatedCard: connection!.card,
      relatedConnection: connection!._id,
    });
    logInfo(
      `Updated a ${connection!.type} connection for user ${req.user!.id}`
    );

    res.status(200).json({
      success: true,
      data: connection,
    });
  }
);

// @desc    Delete connection
// @route   DELETE /api/v1/connections/:id
// @access  Private
export const deleteConnection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return next(
        new ErrorResponse(
          `Connection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure user owns connection
    if (
      connection.user.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user!.id} is not authorized to delete this connection`,
          401
        )
      );
    }

    await connection.deleteOne();
    // Create activity log
    await Activity.create({
      user: req.user!.id,
      type: "connection_deleted",
      details: `Deleted a ${connection.type} connection`,
      relatedCard: connection.card,
      relatedConnection: connection._id,
    });
    logInfo(`Deleted a ${connection.type} connection for user ${req.user!.id}`);

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @desc    Accept connection
// @route   PUT /api/v1/connections/:id/accept
// @access  Private
export const acceptConnection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return next(
        new ErrorResponse(
          `Connection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Check if connection is pending
    if (connection.status !== "pending") {
      return next(
        new ErrorResponse(`Connection is already ${connection.status}`, 400)
      );
    }

    // If it's a shared connection, the contact should be the one accepting
    if (connection.type === "shared" && connection.contact) {
      if (connection.contact.toString() !== req.user!.id) {
        return next(
          new ErrorResponse(
            `User ${req.user!.id} is not authorized to accept this connection`,
            401
          )
        );
      }
    }
    // If it's a collected connection, the user should be the one accepting
    else if (connection.type === "collected") {
      if (connection.user.toString() !== req.user!.id) {
        return next(
          new ErrorResponse(
            `User ${req.user!.id} is not authorized to accept this connection`,
            401
          )
        );
      }
    }

    // Update connection status
    connection.status = "accepted";
    await connection.save();

    res.status(200).json({
      success: true,
      data: connection,
    });
  }
);

// @desc    Reject connection
// @route   PUT /api/v1/connections/:id/reject
// @access  Private
export const rejectConnection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return next(
        new ErrorResponse(
          `Connection not found with id of ${req.params.id}`,
          404
        )
      );
    }

    // Check if connection is pending
    if (connection.status !== "pending") {
      return next(
        new ErrorResponse(`Connection is already ${connection.status}`, 400)
      );
    }

    // If it's a shared connection, the contact should be the one rejecting
    if (connection.type === "shared" && connection.contact) {
      if (connection.contact.toString() !== req.user!.id) {
        return next(
          new ErrorResponse(
            `User ${req.user!.id} is not authorized to reject this connection`,
            401
          )
        );
      }
    }
    // If it's a collected connection, the user should be the one rejecting
    else if (connection.type === "collected") {
      if (connection.user.toString() !== req.user!.id) {
        return next(
          new ErrorResponse(
            `User ${req.user!.id} is not authorized to reject this connection`,
            401
          )
        );
      }
    }

    // Update connection status
    connection.status = "rejected";
    await connection.save();

    res.status(200).json({
      success: true,
      data: connection,
    });
  }
);
