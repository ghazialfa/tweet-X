const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class User {
  //! ─── User ────────────────────────────────────────────────────────────
  static userCollection() {
    return database.collection("User");
  }
  static async register(newUser) {
    return await this.userCollection().insertOne(newUser);
  }
  static async getUserByUsername(username) {
    const regex = new RegExp(username, "i");
    return await this.userCollection().find({ username: regex }).toArray();
  }
  static async getUserById(_id) {
    return await this.userCollection().findOne({ _id: new ObjectId(_id) });
  }
}

module.exports = User;
