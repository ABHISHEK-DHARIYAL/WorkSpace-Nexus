import { Response } from "express";
import { VersionService } from "../services/versionService";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth";

export class VersionController {
  static async getByPage(req: AuthRequest, res: Response) {
    try {
      const versions = await VersionService.getByPage(req.params.pageId);
      sendSuccess(res, versions);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const { pageId, content, title } = req.body;
      const version = await VersionService.createSnapshot(pageId, content, title);
      sendSuccess(res, version, 201);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}
