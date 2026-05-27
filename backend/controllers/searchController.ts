import { Request, Response } from "express";
import { getFirestore } from "firebase-admin/firestore";
import { sendSuccess, sendError } from "../utils/response";

export const SearchController = {
  async search(req: Request, res: Response) {
    try {
      const { query, listingId } = req.query;
      if (!query) return sendError(res, "Search query is required", 400);

      const db = getFirestore();
      let pagesRef = db.collection("pages") as any;

      if (listingId) {
        pagesRef = pagesRef.where("listingId", "==", listingId);
      }

      const snapshot = await pagesRef.get();
      const searchTerm = (query as string).toLowerCase();

      const results = snapshot.docs
        .map((doc: any) => ({ id: doc.id, ...doc.data() }))
        .filter((page: any) => 
          page.title.toLowerCase().includes(searchTerm) || 
          page.content.toLowerCase().includes(searchTerm)
        );

      sendSuccess(res, results);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
};
