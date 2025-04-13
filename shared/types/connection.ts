import { Document } from "mongoose";
import { UserId } from "./user";
import { BusinessCardId } from "./businessCard";

export type ConnectionId = string | Document;

// Connection type options
export type ConnectionType = "shared" | "collected";

// Connection status options
export type ConnectionStatus = "pending" | "accepted" | "rejected";

// External contact information
export interface ExternalContact {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
}

// Base Connection interface (shared between frontend and backend)
export interface IConnection {
  user: UserId;
  contact?: UserId;
  externalContact?: ExternalContact;
  card: BusinessCardId;
  type: ConnectionType;
  status: ConnectionStatus;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Connection interface with ID (for frontend use)
export interface Connection extends IConnection {
  id: string;
}

// Connection document interface (for backend use with Mongoose)
export interface ConnectionDocument extends IConnection, Document {}

// Connection creation data (for creating new connections)
export interface ConnectionCreateData {
  contact?: string;
  externalContact?: ExternalContact;
  card: string;
  type: ConnectionType;
  status?: ConnectionStatus;
  notes?: string;
  tags?: string[];
}

// Connection update data (for updating existing connections)
export interface ConnectionUpdateData extends Partial<ConnectionCreateData> {}

// Connection filter parameters (for querying connections)
export interface ConnectionFilterParams {
  type?: ConnectionType;
  status?: ConnectionStatus;
  card?: string;
  contact?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
