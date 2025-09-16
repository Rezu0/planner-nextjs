import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  username: string;
  password: string;
  token: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String },
  },
  { timestamps: true }
);

delete mongoose.models.User;
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
