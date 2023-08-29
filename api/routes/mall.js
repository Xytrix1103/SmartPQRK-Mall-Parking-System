const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const {getMallID} = require("./token");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	const malls = await prisma.mall.findMany();

	for (let mall of malls) {
		let vacant = 0

		let vacantLots = await prisma.lot.findMany({
			where: {
				mall_id: mall?.id,
				parking_log: {
					every: {
						exit_datetime: {
							not: null
						}
					}
				},
				reservations: {
					every: {
						OR: [
							{
								is_fulfilled: {
									not: null
								},
							},
							{
								is_cancelled: true
							},
							{
								is_expired: true
							}
						]
					}
				}
			},
			include: {
				parking_log: {
					orderBy: {
						id: "desc"
					}
				},
				reservations: {
					orderBy: {
						id: "desc"
					}
				},
				floor: true,
				wing: true
			}
		});

		mall.vacant = vacantLots.length;

		mall.total = await prisma.lot.count({
			where: {
				mall_id: mall?.id
			}
		});
	}

	console.log(malls);
	return res.json(malls);
});

router.post("/getMall", async (req, res) => {
	const mall = await prisma.mall.findUnique({
		where: {
			id: getMallID(req.body.token),
		}
	});

	return res.json(mall);
});

router.post("/update", async (req, res) => {
	const {id, name, address} = req.body;

	const updateMall = await prisma.mall.update({
		where: {
			id: parseInt(id)
		},
		data: {
			name: name,
			address: address,
		}
	});

	return res.json(updateMall);
});

router.post("/getParkingActivity", async (req, res) => {
	const parkingActivity = await prisma.parking_log.findMany({
		where: {
			lot: {
				mall_id: getMallID(req.body.token)
			}
		},
		include: {
			user: true,
			number_plate: true,
			directory: true,
			entry_station: true,
			exit_station: true,
			lot: {
				include: {
					floor: true,
				}
			},
		},
		orderBy: {
			id: "desc"
		}
	});

	console.log(parkingActivity);

	return res.json(parkingActivity);
});

//count parking activity by month
router.post("/getActivityByMonth", async (req, res) => {
	const parkingActivity = await prisma.parking_log.findMany({
		where: {
			lot: {
				mall_id: getMallID(req.body.token)
			}
		}
	});

	let parkingActivityByMonth = [];

	for (let log of parkingActivity) {
		let month = new Date(log.entry_datetime).getMonth();

		if (parkingActivityByMonth[month] === undefined) {
			parkingActivityByMonth[month] = 1;
		} else {
			parkingActivityByMonth[month]++;
		}
	}

	for (let i = 0; i < parkingActivityByMonth.length; i++) {
		if (parkingActivityByMonth[i] === undefined) {
			parkingActivityByMonth[i] = 0;
		}
	}

	return res.json(parkingActivityByMonth);
});

router.post('/getReservations', async (req, res) => {
	const reservations = await prisma.reservations.findMany({
		where: {
			lot: {
				mall_id: getMallID(req.body.token)
			},
		},
		include: {
			user: true,
			number_plate: true,
			directory: true,
			lot: {
				include: {
					floor: true,
				}
			},
		},
		orderBy: {
			id: "desc"
		}
	});

	return res.json(reservations);
});

router.post('/getRevenueByMonth', async (req, res) => {
	const parkingActivity = await prisma.parking_log.findMany({
		where: {
			lot: {
				mall_id: getMallID(req.body.token)
			},
			exit_datetime: {
				not: null
			}
		}
	});

	let revenueByMonth = [];

	for (let log of parkingActivity) {
		let month = new Date(log?.exit_datetime).getMonth();

		if (revenueByMonth[month] === undefined) {
			revenueByMonth[month] = log?.fees;
		} else {
			revenueByMonth[month] += log?.fees;
		}
	}

	for (let i = 0; i < revenueByMonth.length; i++) {
		if (revenueByMonth[i] === undefined) {
			revenueByMonth[i] = 0;
		}
	}

	return res.json(revenueByMonth);
});

router.post('/getParkingHoursByMonth', async (req, res) => {
	const parkingActivity = await prisma.parking_log.findMany({
		where: {
			lot: {
				mall_id: getMallID(req.body.token)
			},
			exit_datetime: {
				not: null
			}
		}
	});

	let parkingHoursByMonth = [];

	for (let log of parkingActivity) {
		let month = new Date(log?.exit_datetime).getMonth();

		if (parkingHoursByMonth[month] === undefined) {
			parkingHoursByMonth[month] = 0;
		}

		if (log?.entry_datetime !== null && log?.exit_datetime !== null) {
			parkingHoursByMonth[month] += Math.ceil((new Date(log?.exit_datetime) - new Date(log?.entry_datetime)) / 3600000);
		}
	}

	for (let i = 0; i < parkingHoursByMonth.length; i++) {
		if (parkingHoursByMonth[i] === undefined) {
			parkingHoursByMonth[i] = 0;
		}
	}

	return res.json(parkingHoursByMonth);
});

router.post('/getLotsStatus', async (req, res) => {
	let lots = await prisma.lot.findMany({
		where: {
			mall_id: getMallID(req.body.token),
		},
		include: {
			parking_log: true,
			reservations: true,
			floor: true,
		}
	});

	for (let lot of lots) {
		lot.occupied = false;

		for (let log of lot.parking_log) {
			if (log.exit_datetime === null) {
				lot.occupied = true;
				break;
			}
		}

		for (let reservation of lot.reservations) {
			if (reservation.is_fulfilled == null && reservation.is_cancelled === false && reservation.is_expired === false) {
				lot.occupied = true;
				break;
			}
		}
	}

	return res.json(lots);
});

module.exports = router;