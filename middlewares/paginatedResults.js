import mongoose from "mongoose";

export const paginatedResults = (Model, select) => {
  return async (req, res, next) => {
    const page = parseInt(req.query?.page); // page no - from request
    const limit = parseInt(req.query?.limit); // max entries per page - from request
    const query = req.query?.query; // search query - from request
    const filterString = req.query?.filter; // for future

    const skipIndex = (page - 1) * limit;
    console.log(query ? query : "Nil", page, limit, skipIndex);

    try {
      if (page && limit) {
        // pagination params defined - return paginated result
        let results = await Model.find({
          api_name_lowercase: query
            ? new RegExp(String(query).toLowerCase())
            : new RegExp(),
        })
          .limit(limit)
          .skip(skipIndex)
          .select(select)
          .exec();

        Model.countDocuments(
          {
            api_name_lowercase: query
              ? new RegExp(String(query).toLowerCase())
              : new RegExp(),
          },
          (error, count) => {
            if (error) {
              console.log(error.message);
            }

            res.paginatedResults = results;
            res.totalDocs = count;
            res.currentPage = page;
            res.nextPage = count - skipIndex - limit > 0 ? true : false;
            res.currentLimit = limit;
            res.nextPageNo = page + 1;
            next();
          }
        );
      }
      // otherwise - return full results
      res.paginatedResults = await Model.find().exec();
      next();
    } catch (err) {
      res.statusMessage = err.message;
      res.sendStatus(500);
    }
  };
};
