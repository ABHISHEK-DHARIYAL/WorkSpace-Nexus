import { Request, Response } from "express";
import { DocIndexService } from "../services/docIndexService";
import { sendSuccess, sendError } from "../utils/response";

export class DocIndexController {
  static async getAll(req: Request, res: Response) {
    try {
      const indices = await DocIndexService.getAll();
      sendSuccess(res, indices);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const index = await DocIndexService.getById(req.params.id);
      if (!index) return sendError(res, "Index item not found", 404);
      sendSuccess(res, index);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const index = await DocIndexService.create(req.body);
      sendSuccess(res, index, 201);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const index = await DocIndexService.update(req.params.id, req.body);
      sendSuccess(res, index);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await DocIndexService.delete(req.params.id);
      sendSuccess(res, result);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}
