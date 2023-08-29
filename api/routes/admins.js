const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const {getAdminID, getMallID} = require("./token");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	const mallAdmins = await prisma.admin.findMany({
		where: {
			mall_id: getMallID(req.body.token)
		},
	});

	return res.json(mallAdmins);
});

router.post("/getAdmin", async (req, res) => {
	const mallAdmins = await prisma.admin.findUnique({
		where: {
			id: getAdminID(req.body.token)
		},
	});

	return res.json(mallAdmins);
});

router.post("/update", async (req, res) => {
	const {id, name, email, username, password, contact, address} = req.body;

	const updateAdmin = await prisma.admin.update({
		where: {
			id: parseInt(id)
		},
		data: {
			name: name,
			email: email,
			username: username,
			password: password,
			contact: contact,
			address: address,
		}
	});

	return res.json(updateAdmin);
});

router.post("/delete", async (req, res) => {
	const {id} = req.body;

	const deleteAdmin = await prisma.admin.delete({
		where: {
			id: parseInt(id)
		}
	});

	return res.json(deleteAdmin);
});

router.post("/create", async (req, res) => {
	const { section, lot_no, wing_id, floor_id, mall_id } = req.body;
	console.log(req.body)

	const createAdmin = await prisma.admin.create({
		data: {
			lot_no: lot_no,
			section: section,
			wing_id: wing_id,
			floor_id: floor_id,
			mall_id: mall_id,
		}
	});

	return res.json(createAdmin);
});

module.exports = router;