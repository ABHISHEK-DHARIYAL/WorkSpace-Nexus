import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { WorkspaceHubExportService } from "../services/workspaceHubExportService";
import { sendError } from "../utils/response";

export class WorkspaceHubExportController {
  /**
   * GET /export/workspace-hub
   * Combiles and exports all of standard user's Workspace Hub projects inside a single ZIP file.
   */
  static async exportHub(req: AuthRequest, res: Response) {
    try {
      const email = req.user?.email;
      if (!email) {
        return sendError(res, "Unauthorized: User not authenticated", 401);
      }

      // Generate the Workspace Hub ZIP in memories
      const zipBuffer = await WorkspaceHubExportService.exportUserWorkspaceHub(email);

      // Set download headers
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="workspace-hub.zip"');
      res.setHeader("Content-Length", zipBuffer.length);

      return res.end(zipBuffer);
    } catch (error: any) {
      console.error("Workspace Hub Export Error:", error);
      return sendError(res, error.message || "Failed to generate Workspace Hub export ZIP package", 500);
    }
  }
}
