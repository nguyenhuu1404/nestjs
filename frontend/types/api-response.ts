export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
