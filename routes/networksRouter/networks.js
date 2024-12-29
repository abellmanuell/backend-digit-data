const express = require("express");
const { findNetworks } = require("../../config/networksQuery/networkdb");
const { server_response } = require("../../utils/server_response");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const networks = await findNetworks();
    return server_response(200, res, "Successfully completed", {
      data: networks,
    });
  } catch {
    throw new Error();
  }
});

module.exports = router;
