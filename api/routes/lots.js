const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const {getMallID} = require("./token");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	const mallLots = await prisma.lot.findMany({
		where: {
			mall_id: getMallID(req.body.token)
		},
		include: {
			floor: true,
			wing: true,
			parking_log: true,
		}
	});

	return res.json(mallLots);
});

router.post("/update", async (req, res) => {
	const {id, lot_no, section, wing_id, floor_id} = req.body;

	const updateLot = await prisma.lot.update({
		where: {
			id: parseInt(id)
		},
		data: {
			lot_no: lot_no,
			section: section,
			wing_id: wing_id,
			floor_id: floor_id,
		}
	});

	return res.json(updateLot);
});

router.post("/delete", async (req, res) => {
	const {id} = req.body;

	const deleteLot = await prisma.lot.delete({
		where: {
			id: parseInt(id)
		}
	});

	return res.json(deleteLot);
});

router.post("/create", async (req, res) => {
	const { section, lot_no, wing_id, floor_id } = req.body;

	const createLot = await prisma.lot.create({
		data: {
			lot_no: lot_no,
			section: section,
			wing_id: wing_id,
			floor_id: floor_id,
			mall_id: getMallID(req.body.token),
		}
	});

	return res.json(createLot);
});

module.exports = router;