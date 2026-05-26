import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { adminAuth, db, doc, getDoc } from "../config/firebase";
import { ENV } from "../config/env";
import { sendError } from "../utils/response";

export interface AuthRequest extends Request {
  user?: any;
}

export const optionalAuthenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }

  // Try Firebase Token FIRST
  if (token.length > 500) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      
      let role = "user";
      try {
        if (db && decodedToken.email) {
          const userRef = doc(db, "users", decodedToken.email);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            role = (userDoc.data() as any).role || "user";
          }
        }
      } catch (dbErr) {
        console.warn("Auth: Could not fetch user role from Firestore", dbErr);
      }
      
      req.user = { 
        email: decodedToken.email || "", 
        role: role,
        uid: decodedToken.uid 
      };
      return next();
    } catch (fbErr: any) {
      req.user = null;
      return next();
    }
  }

  // Custom JWT Verification
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
    req.user = decoded;
    if (!req.user.uid && req.user.email) {
      req.user.uid = req.user.email;
    }
    return next();
  } catch (jwtErr: any) {
    req.user = null;
    return next();
  }
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return sendError(res, "Unauthorized: No token provided", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return sendError(res, "Unauthorized: Malformed token", 401);
  }

  // Try Firebase Token FIRST
  if (token.length > 500) { // Firebase tokens are typically much longer than our custom ones
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      
      let role = "user";
      try {
        if (db && decodedToken.email) {
          const userRef = doc(db, "users", decodedToken.email);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            role = (userDoc.data() as any).role || "user";
          }
        }
      } catch (dbErr) {
        console.warn("Auth: Could not fetch user role from Firestore", dbErr);
      }
      
      req.user = { 
        email: decodedToken.email || "", 
        role: role,
        uid: decodedToken.uid 
      };
      return next();
    } catch (fbErr: any) {
      if (fbErr.code === 'auth/id-token-expired') {
        return sendError(res, "Token expired", 401, "EXPIRED");
      }
      console.warn("Auth: Firebase token verification skipped or failed:", fbErr.message);
      // Fall through to custom JWT
    }
  }

  // Custom JWT Verification
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
    req.user = decoded;
    // ensure uid exists for backward compatibility if needed, using email as fallback
    if (!req.user.uid && req.user.email) {
      req.user.uid = req.user.email;
    }
    return next();
  } catch (jwtErr: any) {
    if (jwtErr.name === "TokenExpiredError") {
      console.warn("Auth: Token verification failed.", jwtErr.message);
      return sendError(res, "Auth: Token verification failed. jwt expired", 401, "EXPIRED");
    }
    console.error("Auth: Token verification failed.", jwtErr.message);
    return sendError(res, "Invalid or expired token", 401);
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return sendError(res, "Forbidden: Admin access required", 403);
  }
  next();
};
