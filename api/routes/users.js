const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {getUserID, getAdminID, getMallID} = require("./token");

router.post("/", async (req, res) => {
	const {token} = req.body;
	let jsonResponse = {
		msg: "",
		success: false
	}

	if (!token) {
		jsonResponse.msg = "Invalid credentials";
		jsonResponse.success = false;
	} else {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
			if (err) {
				jsonResponse.msg = "Invalid credentials";
				jsonResponse.success = false;
			} else {
				const user = await prisma.user.findFirst({
					where: {
						id: decoded.user.id
					}
				})

				if (!user) {
					jsonResponse.msg = "Invalid credentials";
					jsonResponse.success = false;
				} else {
					jsonResponse.msg = "Valid credentials. User logged in.";
					jsonResponse.success = true;
				}
			}
		});
	}
});

router.post("/getUser", async (req, res) => {
	const {token} = req.body;

	const user = await prisma.user.findFirst({
		where: {
			id: getUserID(token) || 0
		},
		include: {
			parking_log: {
				include: {
					lot: {
						include: {
							floor: true,
							wing: true
						}
					},
					reservations: true,
					directory: true,
					entry_station: true,
					exit_station: true,
					number_plate: true
				},
				orderBy: {
					id: "desc"
				}
			},
			reservations: {
				include: {
					directory: true,
					number_plate: true,
					lot: {
						include: {
							floor: true,
							wing: true
						}
					},
				},
				orderBy: {
					id: "desc"
				}
			},
			number_plate: true
		}
	})

	console.log("got user", user);

	return res.json(user);
})

router.post("/getUsers", async (req, res) => {
	const users = await prisma.user.findMany({
		where: {
			parking_log: {
				some: {
					lot: {
						mall_id: getMallID(req.body.token)
					}
				}
			}
		}
	})

	return res.json(users);
})

router.post("/getNumberPlates", async (req, res) => {
	const {token} = req.body;

	const numberPlates = await prisma.number_plate.findMany({
		where: {
			user_id: getUserID(token)
		}
	})

	return res.json(numberPlates);
})

router.post("/getParked", async (req, res) => {
	const {token} = req.body;

	const parked = await prisma.parking_log.findFirst({
		where: {
			user_id: getUserID(token)
		},
		include: {
			user: true,
			reservations: true,
			number_plate: true,
			directory: true,
			entry_station: true,
			exit_station: true,
			lot: {
				include: {
					floor: true,
					wing: true
				}
			},
		},
		orderBy: {
			id: "desc"
		}
	})

	console.log(parked);

	return res.json(parked);
})

router.post('/getHistory', async (req, res) => {
	const {token} = req.body

	const history = await prisma.parking_log.findMany({
		where: {
			user_id: getUserID(token),
		},
		include: {
			user: true,
			number_plate: true,
			directory: true,
			entry_station: true,
			exit_station: true,
			lot: true,
		},
		orderBy: {
			id: "desc"
		}
	})

	console.log(history);

	return res.json(history);
})

router.post("/updateUser", async (req, res) => {
	const {token, name, email, contact, address, username, new_password} = req.body;

	const user = await prisma.user.update({
		where: {
			id: getUserID(token)
		},
		data: {
			name: name,
			email: email,
			contact: contact,
			address: address,
			username: username,
			password: new_password ? new_password : undefined
		}
	})

	return res.json(user);
})

router.post("/addNumberPlate", async (req, res) => {
	const {token, number_plate} = req.body;

	const newNumberPlate = await prisma.number_plate.create({
		data: {
			user_id: getUserID(token),
			number_plate: number_plate
		}
	})

	return res.json(newNumberPlate);
})

router.post("/register", async (req, res) => {
	const {name, email, contact, address, username, password} = req.body;

	const newUser = await prisma.user.create({
		data: {
			name: name,
			email: email,
			contact: contact,
			address: address,
			username: username,
			password: password
		}
	})

	return res.json(newUser);
})

module.exports = router;