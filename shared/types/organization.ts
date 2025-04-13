import { Document } from 'mongoose';
import { UserId } from './user';

// Organization size options
export type OrganizationSize = '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';

// Organization status options
export type OrganizationStatus = 'active' | 'inactive';

// Type for Organization ID (used for references)
export type OrganizationId = string | Document;

// Base Organization interface (shared between frontend and backend)
export interface IOrganization {
  name: string;
  description?: string;
  logo: string;
  website?: string;
  industry?: string;
  size: OrganizationSize;
  location?: string;
  status: OrganizationStatus;
  owner: UserId;
  admins: UserId[];
  createdAt: Date;
  updatedAt: Date;
}

// Organization interface with ID (for frontend use)
export interface Organization extends IOrganization {
  id: string;
}

// Organization document interface (for backend use with Mongoose)
export interface OrganizationDocument extends IOrganization, Document {}

// Organization creation data (for creating new organizations)
export interface OrganizationCreateData {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: OrganizationSize;
  location?: string;
  status?: OrganizationStatus;
  admins?: string[];
}

// Organization update data (for updating existing organizations)
export interface OrganizationUpdateData extends Partial<OrganizationCreateData> {}

// Organization filter parameters (for querying organizations)
export interface OrganizationFilterParams {
  search?: string;
  industry?: string;
  size?: OrganizationSize;
  status?: OrganizationStatus;
  page?: number;
  limit?: number;
  sort?: string;
}
