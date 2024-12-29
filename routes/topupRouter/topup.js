const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("Sending request here...");
});

module.exports = router;
