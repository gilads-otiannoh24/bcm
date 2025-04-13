import { Document } from "mongoose";
import { UserId } from "./user";
import { BusinessCardId } from "./businessCard";

export type CardCollectionId = string | Document;

// Base Card Collection interface (shared between frontend and backend)
export interface ICardCollection {
  user: UserId;
  card: BusinessCardId;
  collectedAt: Date;
  notes?: string;
  tags?: string[];
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Card Collection interface with ID (for frontend use)
export interface CardCollection extends ICardCollection {
  id: string;
}

// Card Collection document interface (for backend use with Mongoose)
export interface CardCollectionDocument extends ICardCollection, Document {}

// Card Collection creation data (for creating new collections)
export interface CardCollectionCreateData {
  card: string;
  notes?: string;
  tags?: string[];
  favorite?: boolean;
}

// Card Collection update data (for updating existing collections)
export interface CardCollectionUpdateData
  extends Partial<CardCollectionCreateData> {}

// Card Collection filter parameters (for querying collections)
export interface CardCollectionFilterParams {
  favorite?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sort?: string;
}
