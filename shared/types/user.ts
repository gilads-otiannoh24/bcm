import { Document } from "mongoose";
import { OrganizationId } from "./organization";

// Social links interface
export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

// User roles
export type UserRole = "user" | "premium" | "admin";

// User status
export type UserStatus = "active" | "inactive" | "pending";

// Base User interface (shared between frontend and backend)
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  phone?: string;
  socialLinks: SocialLinks;
  organization?: OrganizationId;
  lastLogin?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// User interface with ID (for frontend use)
export interface User extends IUser {
  id: string;
  fullName: string;
  cards: number;
  updatedAt: string;
  createdAt: string;
  lastLogin: string;
}

export type UserId = string | Document;

// User document interface (for backend use with Mongoose)
export interface UserDocument extends IUser, Document {
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  fullName: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

// User creation data (for creating new users)
export interface UserCreateData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional as it can be auto-generated
  role?: UserRole;
  status?: UserStatus;
  jobTitle?: string;
  company?: string;
  location?: string;
  phone?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  organization?: string;
}

// User update data (for updating existing users)
export interface UserUpdateData extends Partial<UserCreateData> {}

// User filter parameters (for querying users)
export interface UserFilterParams {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  organization?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
