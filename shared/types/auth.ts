import { User } from "./user";

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Registration data interface
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Auth response interface
export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user?: User;
}

// Refresh token request interface
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Password update request interface
export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}
// Password reset request interface
export interface PasswordResetRequest {
  confirmPassword: string;
  password: string;
  token: string;
}

// User details update request interface
export interface UpdateDetailsRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  phone?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}
