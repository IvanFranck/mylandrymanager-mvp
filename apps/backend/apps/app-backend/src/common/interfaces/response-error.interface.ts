export interface ResponseErrorInterface extends Error {
  response: {
    message: string | string[];
    error: string;
    statusCode: number;
  };
  statusCode?: number;
}
