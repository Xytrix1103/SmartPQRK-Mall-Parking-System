const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const verifyToken = require("./token");
const {getMallID} = require("./token");

router.post("/", async (req, res) => {
	const floors = await prisma.floor.findMany({
		where: {
			mall_id: getMallID(req.body.token)
		}
	});

	// console.log(floors);

	return res.json(floors);
});

router.post("/getFromID", async (req, res) => {
	const floors = await prisma.floor.findMany({
		where: {
			mall_id: Number(req.body.mall_id)
		}
	});

	// console.log(floors);

	return res.json(floors);
});

router.post("/update", async (req, res) => {
	const {id, floor_no} = req.body;

	const updateFloor = await prisma.floor.update({
		where: {
			id: parseInt(id)
		},
		data: {
			floor_no: floor_no,
		}
	});

	return res.json(updateFloor);
});

router.post("/delete", async (req, res) => {
	const {id} = req.body;
	console.log(req.body)

	const deleteFloor = await prisma.floor.delete({
		where: {
			id: parseInt(id)
		}
	});

	return res.json(deleteFloor);
});

router.post("/create", async (req, res) => {
	const { floor_no } = req.body;
	console.log(req.body)

	const createFloor = await prisma.floor.create({
		data: {
			floor_no: floor_no,
			mall_id: getMallID(req.body.token),
		}
	});

	return res.json(createFloor);
});

module.exports = router;