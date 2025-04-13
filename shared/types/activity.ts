import { Document } from 'mongoose';
import { UserId } from './user';
import { BusinessCardId } from './businessCard';
import { ConnectionId } from './connection';

// Activity type options
export type ActivityType =
  | 'user_created'
  | 'card_created'
  | 'card_shared'
  | 'card_collected'
  | 'user_deleted'
  | 'card_deleted'
  | 'connection_created'
  | 'card_updated';

// Base Activity interface (shared between frontend and backend)
export interface IActivity {
  user: UserId;
  type: ActivityType;
  details: string;
  relatedUser?: UserId;
  relatedCard?: BusinessCardId;
  relatedConnection?: ConnectionId;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Activity interface with ID (for frontend use)
export interface Activity extends IActivity {
  id: string;
}

// Activity document interface (for backend use with Mongoose)
export interface ActivityDocument extends IActivity, Document {}

// Activity filter parameters (for querying activities)
export interface ActivityFilterParams {
  type?: ActivityType;
  user?: string;
  relatedUser?: string;
  relatedCard?: string;
  relatedConnection?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sort?: string;
}
