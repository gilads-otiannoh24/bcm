// Generic API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// API error response interface
export interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  pagination: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  };
  data: T[];
}

// Common query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  select?: string;
  [key: string]: any; // For additional filters
}
