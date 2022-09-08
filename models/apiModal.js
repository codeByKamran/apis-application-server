import mongoose from "mongoose";

const apiSchema = new mongoose.Schema(
  {
    API: { type: String, required: true },
    Slug: { type: String, required: true },
    api_name_lowercase: { type: String, required: true },
    Description: { type: String },
    Auth: { type: String },
    HTTPS: { type: Boolean },
    Cors: { type: String },
    Link: { type: String },
    Category: { type: String },
  },
  { timestamps: true }
);

const apiModal = mongoose.model("API", apiSchema);

export default apiModal;
