import dotenv from "dotenv";

dotenv.config();

let environment = process.env.NODE_ENV;

export default {
  MONGO_URI:
    environment === "production"
      ? process.env.ATLAS_MONGO_URI
      : process.env.LOCAL_MONGO_URI,
  APIs_API_ENDPOINT: process.env.APIs_API_ENDPOINT,
};
