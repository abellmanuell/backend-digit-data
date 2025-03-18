const express = require("express");
const { server_response } = require("../../utils/server_response");
const { default: fetcher } = require("../../utils/fetcher");
const router = express.Router();

router.get("/", async (req, res) => {
  // try {
  const dataPlans = await fetcher.get("/user");

  return server_response(200, res, "Successfully fetched!", {
    data: dataPlans.Dataplans,
  });
  /* } catch {
    throw new Error("Unexpected occured while fetching dataplans");
  } */
});

module.exports = router;
