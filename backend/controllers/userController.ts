import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { sendSuccess, sendError } from "../utils/response";

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      sendSuccess(res, users);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}
