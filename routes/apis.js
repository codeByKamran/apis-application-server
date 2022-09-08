import express from "express";
import {
  getAllAPIs,
  getAPIById,
  getManyAPIs,
  syncAPIsInMongoDB,
} from "../controllers/apisController.js";
import { paginatedResults } from "../middlewares/paginatedResults.js";
import API from "../models/apiModal.js";
const apisRouter = express.Router();

// Routes

apisRouter.get("/sync", syncAPIsInMongoDB);

apisRouter.get("/:id", getAPIById);

apisRouter.get(
  "/",
  paginatedResults(API, "API Slug Link Description Category HTTPS Cors Auth"),
  getAllAPIs
);

apisRouter.post("/many", getManyAPIs);

export default apisRouter;
