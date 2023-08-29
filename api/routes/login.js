const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

router.post("/admin", async (req, res) => {
	const { username, password } = req.body;
	let jsonResponse = {
		msg: "",
		token: "",
	};

	try {
		const admin = await prisma.admin.findFirst({
			where: {
				username: username,
			}
		});

		if (!admin) {
			jsonResponse.msg = "Invalid credentials";
		} else {
			if (password !== admin.password) {
				jsonResponse.msg = "Invalid credentials";
			} else {
				const payload = {
					admin: {
						id: admin.id,
						mall_id: admin.mall_id,
					},
				};

				const token = await new Promise((resolve, reject) => {
					jwt.sign(
						payload,
						process.env.JWT_SECRET,
						{
							expiresIn: process.env.JWT_EXPIRES_IN,
						},
						(err, token) => {
							if (err) {
								console.error(err);
								reject("Failed to generate JWT token");
							} else {
								resolve(token);
							}
						}
					);
				});

				console.log("token:", token);
				jsonResponse.msg = "Valid credentials. Admin logged in.";
				jsonResponse.token = token;
			}
		}
	} catch (err) {
		console.error(err);
		jsonResponse.msg = "Failed to generate JWT token";
	}

	return res.json(jsonResponse);
});

router.post("/user", async (req, res) => {
	const { username, password } = req.body;
	let jsonResponse = {
		msg: "",
		token: "",
	};

	try {
		const user = await prisma.user.findFirst({
			where: {
				username: username,
			}
		});

		if (!user) {
			jsonResponse.msg = "Invalid credentials";
		} else {
			if (password !== user.password) {
				jsonResponse.msg = "Invalid credentials";
			} else {
				const payload = {
					user: {
						id: user.id,
					},
				};

				const token = await new Promise((resolve, reject) => {
					jwt.sign(
						payload,
						process.env.JWT_SECRET,
						{
							expiresIn: process.env.JWT_EXPIRES_IN,
						},
						(err, token) => {
							if (err) {
								console.error(err);
								reject("Failed to generate JWT token");
							} else {
								resolve(token);
							}
						}
					);
				});

				console.log("token:", token);
				jsonResponse.msg = "Valid credentials. User logged in.";
				jsonResponse.token = token;
			}
		}
	} catch (err) {
		console.error(err);
		jsonResponse.msg = "Failed to generate JWT token";
	}

	console.log(jsonResponse);
	return res.json(jsonResponse);
});

module.exports = router;