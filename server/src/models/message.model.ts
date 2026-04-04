import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  subject: string;
}

const messageSchema = new Schema<IMessage>(
  {
    name: String,
    email: String,
    message: String,
    subject: String,
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", messageSchema);