const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
	return res.json({msg: "User logged out", success: true});
});

module.exports = router;