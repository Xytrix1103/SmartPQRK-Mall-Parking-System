const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const verifyToken = require("./token");
const {getMallID} = require("./token");

router.post("/", async (req, res) => {
	const wings = await prisma.wing.findMany({
		where: {
			mall_id: getMallID(req.body.token)
		}
	});

	return res.json(wings);
});

router.post("/getFromID", async (req, res) => {
	const wings = await prisma.wing.findMany({
		where: {
			mall_id: Number(req.body.mall_id)
		}
	});

	return res.json(wings);
});

router.post("/update", async (req, res) => {
	const {id, wing} = req.body;

	const updateWing = await prisma.wing.update({
		where: {
			id: parseInt(id)
		},
		data: {
			wing: wing,
		}
	});

	return res.json(updateWing);
})

router.post("/delete", async (req, res) => {
	const {id} = req.body;
	console.log(req.body)

	const deleteWing = await prisma.wing.delete({
		where: {
			id: parseInt(id)
		}
	});

	return res.json(deleteWing);
})

router.post("/create", async (req, res) => {
	const { wing } = req.body;
	console.log(req.body)

	const createWing = await prisma.wing.create({
		data: {
			wing: wing,
			mall_id: getMallID(req.body.token),
		}
	});

	return res.json(createWing);
})

module.exports = router;