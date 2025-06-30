export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  token?: string;
  requires2FA?: boolean;
  userId?: string;
} 