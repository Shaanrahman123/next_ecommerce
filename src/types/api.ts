export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  statusCode: number;
  data?: T;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
