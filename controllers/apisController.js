import API from "../models/apiModal.js";
import fetch from "node-fetch";
import config from "../config/env.js";
import dashify from "dashify";

export const getAllAPIs = async (req, res) => {
  const {
    paginatedResults,
    totalDocs,
    nextPage,
    currentPage,
    currentLimit,
    nextPageNo,
  } = res;

  res.status(200).json({
    data: paginatedResults,
    totalDocs,
    currentLimit,
    currentPage,
    nextPageNo,
    nextPage,
  });
};

export const getManyAPIs = async (req, res) => {
  const ids = req.body.ids;
  try {
    const result = await API.find({
      _id: { $in: ids },
    }).select("API Slug Link Description Category Auth HTTPS Cors");

    if (!result) {
      res.statusMessage = "Nothing Found";
      return res.sendStatus(204);
    }
    res.statusMessage = "Data Found";
    res.status(200).json(result);
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};

export const getAPIById = async (req, res) => {
  const id = req.params.id;
  try {
    const found = await API.findById(id)
      .select("API Slug Link Description Category Auth HTTPS Cors")
      .exec();
    if (!found) {
      res.statusMessage = "Data Found";
      return res.sendStatus(204);
    }

    res.status(200).json(found);
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};

export const syncAPIsInMongoDB = async (req, res) => {
  try {
    // fetch data from API
    const response = await fetch(config.APIs_API_ENDPOINT);
    const data = await response.json();

    if (!data.entries || data.entries.length < 1) {
      res.statusMessage = "Nothing found";
      res.sendStatus(204);
    }

    // clean db

    API.db.dropCollection("apis", (error, result) => {
      if (error) {
        console.log(error.message);
      }

      console.log("Collection droped", result);
    });

    // Store data to MongoDB

    data.entries.forEach(async (entry) => {
      const modifiedEntry = {
        ...entry,
        Slug: dashify(entry.API),
        api_name_lowercase: String(entry.API).toLowerCase(),
      };
      await API.create(modifiedEntry);
    });

    console.log("Data fetched and synced with API");

    res.statusMessage = "Data fetched and synced in MongoDB";
    res.sendStatus(201);
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};
