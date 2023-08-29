const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const {getMallID} = require("./token");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	const {id: user_id, exit_station_id} = req.body;

	const latestEntry = await prisma.parking_log.findMany({
		where: {
			user_id: user_id,
			exit_datetime: null
		},
		orderBy: {
			id: "desc"
		},
		take: 1,
	});

	console.log("latestEntry", latestEntry);

	//calculate parking fees
	const entry = latestEntry[0];
	const entry_datetime = new Date(entry.entry_datetime);
	const exit_datetime = new Date();
	const diff = Math.abs(exit_datetime - entry_datetime);
	const diffHours = Math.ceil(diff / (1000 * 60 * 60));
	const fees = diffHours * 3;

	const exit = await prisma.parking_log.update({
		where: {
			id: latestEntry[0].id,
		},
		data: {
			exit_datetime: exit_datetime,
			exit_station_id: exit_station_id,
			fees: fees,
		},
		include: {
			lot: true,
			directory: true,
			entry_station: true,
			exit_station: true,
		}
	});

	console.log(exit);

	return res.json(exit);
});

module.exports = router;