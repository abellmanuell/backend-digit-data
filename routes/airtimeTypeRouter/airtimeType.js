const express = require("express");
const { server_response } = require("../../utils/server_response");
const {
  findAirtimeType,
} = require("../../config/airtimeTypeQuery/airtimeTypedb");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const networks = await findAirtimeType();
    return server_response(200, res, "Successfully completed", {
      data: networks,
    });
  } catch {
    throw new Error();
  }
});

module.exports = router;
