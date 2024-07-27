export interface CustomError extends Error {
  message: string;
  stack?: string;
  code?: number;
  status?: number;
  statusCode?: number;
}
