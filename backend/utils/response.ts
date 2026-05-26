import { Response } from "express";

export const sendSuccess = (res: Response, data: any, status = 200) => {
  return res.status(status).json(data);
};

export const sendError = (res: Response, message: string, status = 500, code?: string) => {
  const response: any = { message };
  if (code) response.code = code;
  return res.status(status).json(response);
};
