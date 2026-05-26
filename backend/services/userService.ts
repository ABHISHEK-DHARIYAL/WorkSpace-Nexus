import { collection, getDocs, db } from "../config/firebase";

export class UserService {
  static async getAll() {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      if (data.password) delete data.password;
      return data;
    });
  }
}
