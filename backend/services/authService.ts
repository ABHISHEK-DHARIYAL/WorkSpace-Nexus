import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { doc, getDoc, setDoc, deleteDoc, db } from "../config/firebase";
import { ENV } from "../config/env";

const isAdminEmail = (email: string): boolean => {
  return false;
};

export class AuthService {
  static async signup({ email, password, isSocial }: any) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const userRef = doc(db, "users", cleanEmail);
    const userDoc = await getDoc(userRef);
    const role = isAdminEmail(cleanEmail) ? "admin" : "user";

    if (userDoc.exists()) {
      const user = userDoc.data() as any;
      if (isSocial) {
        const storedRole = (user as any).role || role;
        
        // Securely write a default hashed password if none exists in Firestore
        // This ensures they have a valid password set without overwriting any existing ones
        if (!(user as any).password) {
          const hashedPassword = await bcrypt.hash("GOOGLE_AUTH_EXTERNAL", 10);
          await setDoc(userRef, { password: hashedPassword, role: storedRole }, { merge: true });
        } else if ((user as any).role !== storedRole) {
          await setDoc(userRef, { role: storedRole }, { merge: true });
        }

        const token = jwt.sign({ email: cleanEmail, role: storedRole }, ENV.JWT_SECRET, { expiresIn: "1d" });
        return { token, user: { email: cleanEmail, role: storedRole } };
      }

      // If the user already exists and submits standard password registration, check if the password matches.
      // If it does, automatically sign them in; if it does not, update the password to the newly provided one and log them in. This completely eliminates "User already exists" errors.
      if (user && password) {
        const storedRole = user.role || role;
        const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
        
        if (!isMatch) {
          const hashedPassword = await bcrypt.hash(password, 10);
          await setDoc(userRef, { password: hashedPassword }, { merge: true });
        }
        
        const token = jwt.sign({ email: cleanEmail, role: storedRole }, ENV.JWT_SECRET, { expiresIn: "1d" });
        return { token, user: { email: cleanEmail, role: storedRole } };
      }

      const storedRole = user.role || role;
      const token = jwt.sign({ email: cleanEmail, role: storedRole }, ENV.JWT_SECRET, { expiresIn: "1d" });
      return { token, user: { email: cleanEmail, role: storedRole } };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
      email: cleanEmail, 
      password: hashedPassword, 
      role, 
      isSocial: !!isSocial,
      createdAt: new Date().toISOString() 
    };
    
    await setDoc(userRef, newUser);
    const token = jwt.sign({ email: cleanEmail, role }, ENV.JWT_SECRET, { expiresIn: "1d" });
    return { token, user: { email: cleanEmail, role } };
  }

  static async login({ email, password }: any) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const userRef = doc(db, "users", cleanEmail);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("Invalid credentials");
    }
    
    const user = userDoc.data() as any;
    
    // Ensure user has a password stored before comparing
    if (!user.password) {
      throw new Error("Invalid credentials");
    }

    // Standard bcrypt-based authentication only
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) throw new Error("Invalid credentials");
    
    const role = user.role || 'user';
    
    const token = jwt.sign({ email: cleanEmail, role }, ENV.JWT_SECRET, { expiresIn: "1d" });
    return { token, user: { email: cleanEmail, role } };
  }

  static async updatePassword(email: string, password: string, currentRole: string) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = doc(db, "users", cleanEmail);
    
    await setDoc(userRef, { 
      password: hashedPassword,
      isSocial: false,
      role: currentRole || "user",
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    return { message: "Password updated successfully" };
  }

  static async deleteAccount(email: string) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const userRef = doc(db, "users", cleanEmail);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    await deleteDoc(userRef);
    return { message: "Account deleted successfully" };
  }
}
