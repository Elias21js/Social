export interface RegisterResponse {
  success: boolean;
  user?: { id: string; name: string };
  error?: string;
  message?: string;
}
