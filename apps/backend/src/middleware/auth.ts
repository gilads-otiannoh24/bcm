import { NextFunction, Request, Response } from "express";
import { IUser, User } from "../models/User";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "./async";

const jwt = require("jsonwebtoken");
interface JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Protect routes
export const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      // Set token from cookie
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = (await User.findById(decoded.id)) as IUser;
      next();
    } catch (err) {
      return next(
        new ErrorResponse(
          "Not authorized to access this route : errr" + err,
          401
        )
      );
    }
  }
);

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${
            req.user?.role || "undefined"
          } is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
