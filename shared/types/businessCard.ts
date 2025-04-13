import { Document } from "mongoose";
import { User, UserId } from "./user";
import { OrganizationId } from "./organization";

// Card template types
export type CardTemplate =
  | "professional"
  | "creative"
  | "minimal"
  | "bold"
  | "elegant";

// Card status types
export type CardStatus = "active" | "inactive" | "draft";

// Base Business Card interface (shared between frontend and backend)
export interface IBusinessCard {
  title: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  template: CardTemplate;
  color: string;
  status: CardStatus;
  views: number;
  shares: number;
  owner: UserId | User;
  organization?: OrganizationId;
  preview: string;
  shareableLink?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Business Card interface with ID (for frontend use)
export interface BusinessCard extends IBusinessCard {
  id: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

// Business Card document interface (for backend use with Mongoose)
export interface BusinessCardDocument extends IBusinessCard, Document {}

// Business Card creation data (for creating new cards)
export interface BusinessCardCreateData {
  title: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  template?: CardTemplate;
  color?: string;
  status?: CardStatus;
}

// Business Card update data (for updating existing cards)
export interface BusinessCardUpdateData
  extends Partial<BusinessCardCreateData> {}

// Business Card filter parameters (for querying cards)
export interface BusinessCardFilterParams {
  search?: string;
  template?: CardTemplate;
  status?: CardStatus;
  owner?: string;
  organization?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export type BusinessCardId = string | Document;

// Business Card stats response
export interface BusinessCardStats {
  views: number;
  shares: number;
  recentActivities: any[]; // This could be more specific if needed
}
