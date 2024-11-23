import mongoose, { Document, Schema, Model } from "mongoose";

// Define the IUser interface
export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  city: string;
  treeCount?: number;
  icon?: string;
  bonus?: number;
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String },
    password: { type: String, required: true },
    city: { type: String },
    treeCount: { type: Number },
    icon: { type: String , default: "https://art.pixilart.com/0433de3a9dca4b9.png"},
    bonus: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
