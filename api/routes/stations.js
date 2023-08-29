const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const {getMallID} = require("./token");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	console.log(req.body);
	const mallStations = await prisma.station.findMany({
		where: {
			mall_id: req.body.mall_id
		}
	});

	console.log(mallStations);

	return res.json(mallStations);
});

module.exports = router;