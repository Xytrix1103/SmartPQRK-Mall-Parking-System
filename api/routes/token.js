const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.post("/verify", async (req, res) => {
	const token = req.body.token;

	const result = await verifyToken(token);
	console.log(result);
	return res.json(result);
});

router.post("/getAdminID", async (req, res) => {
	const token = req.body.token;

	const result = getAdminID(token);
	return res.json(result);
});

router.post("/getMallID", async (req, res) => {
	const token = req.body.token;

	const result = getMallID(token);''
	return res.json(result);
});

const verifyToken = async (token) => {
	let jsonResponse = {};

	try {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				jsonResponse.msg = "Invalid credentials";
				jsonResponse.success = false;
			} else {
				const currentTime = Date.now() / 1000;
				if(decoded.exp <= currentTime) {
					jsonResponse.msg = "Invalid credentials";
					jsonResponse.success = false;
					console.log("Token expired");
				} else {
					jsonResponse.msg = "Valid credentials. User logged in.";
					jsonResponse.success = true;

				}
			}
		});
	} catch (err) {
		console.error(err);
	}

	return jsonResponse;
};

const getAdminID = (token) => {
	let adminID = 0;

	try {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return (adminID = null);
			}

			adminID = decoded.admin.id;
		});
	} catch (err) {
		console.error(err);
	}

	return adminID;
};

const getMallID = (token) => {
	let mall_id = 0;

	try {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return (mall_id = null);
			}

			mall_id = decoded["admin"].mall_id;
		});
	} catch (err) {
		console.error(err);
	}

	return mall_id;
}

const getUserID = (token) => {
	let user_id = 0;

	try {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return (user_id = null);
			}

			user_id = decoded["user"].id;
		});
	} catch (err) {
		console.error(err);
	}

	return user_id;
}

router.post("/getUserID", async (req, res) => {
	const token = req.body.token;

	const result = getUserID(token);
	return res.json(result);
});

module.exports = {
	router,
	verifyToken,
	getAdminID,
	getMallID,
	getUserID
}