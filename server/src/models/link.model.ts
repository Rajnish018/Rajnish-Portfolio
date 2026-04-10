import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
});

const identitySchema = new mongoose.Schema(
  {
    profilePhoto: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    links: [linkSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Identity", identitySchema);