// src/common/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
