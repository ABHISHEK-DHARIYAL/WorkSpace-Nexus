import { Request, Response } from "express";
import { HighlightService } from "../services/highlightService";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth";

export class HighlightController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const highlights = await HighlightService.getAll();
      sendSuccess(res, highlights);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  static async getByPage(req: AuthRequest, res: Response) {
    try {
      const highlights = await HighlightService.getByPage(req.params.pageId);
      sendSuccess(res, highlights);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      console.log("HighlightController.create: Received data", req.body);
      const highlight = await HighlightService.create({
        ...req.body,
        userId: req.user?.uid || req.user?.email
      });
      sendSuccess(res, highlight, 201);
    } catch (error: any) {
      console.error("HighlightController.create Error:", error);
      sendError(res, error.message);
    }
  }
}
