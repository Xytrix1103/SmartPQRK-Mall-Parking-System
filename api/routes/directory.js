const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const {getMallID} = require("./token");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	const mallDirectory = await prisma.directory.findMany({
		where: {
			mall_id: getMallID(req.body.token)
		},
	});

	// console.log(mallDirectory);

	return res.json(mallDirectory);
});

router.post("/getFromID", async (req, res) => {
	const mallDirectory = await prisma.directory.findMany({
		where: {
			mall_id: Number(req.body.mall_id)
		},
	});

	// console.log(mallDirectory);

	return res.json(mallDirectory);
});

router.post("/update", async (req, res) => {
	const {id, name, lot_no, wing_id, floor_id} = req.body;

	const updateDirectory = await prisma.directory.update({
		where: {
			id: parseInt(id)
		},
		data: {
			name: name,
			lot_no: lot_no,
			wing_id: wing_id,
			floor_id: floor_id,
		}
	});

	return res.json(updateDirectory);
});

router.post("/delete", async (req, res) => {
	const {id} = req.body;
	console.log(req.body)

	const deleteDirectory = await prisma.directory.delete({
		where: {
			id: parseInt(id)
		}
	});

	return res.json(deleteDirectory);
});

router.post("/create", async (req, res) => {
	const { name, lot_no, wing_id, floor_id } = req.body;
	console.log(req.body)

	const createDirectory = await prisma.directory.create({
		data: {
			name: name,
			lot_no: lot_no,
			wing_id: wing_id,
			floor_id: floor_id,
			mall_id: getMallID(req.body.token),
		}
	});

	return res.json(createDirectory);
});

module.exports = router;