const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const {getMallID} = require("./token");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	const { mall_id, id, number_plate, directory, reservation_datetime } = req.body;

	console.log(req.body);

	let vacantLots = await prisma.lot.findMany({
		where: {
			mall_id: mall_id,
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

	for (let lot of vacantLots) {
		lot.distance = Math.abs(directory.lot_no - lot.lot_no) + (Math.abs(directory.floor_id - lot.floor_id) * 10);
	}

	vacantLots.sort((a, b) => {
		return a.distance - b.distance;
	});

	console.log(vacantLots);

	const createReservation = await prisma.reservations.create({
		data: {
			user_id: id,
			number_plate_id: number_plate.id,
			reservation_datetime: reservation_datetime,
			directory_id: directory.id,
			lot_id: vacantLots[0].id,
			is_cancelled: false,
			is_expired: false,
		}
	});

	console.log(createReservation);

	return res.json({
		...createReservation,
		lot: vacantLots[0],
	});
});

//cancel reservation
router.post("/cancel", async (req, res) => {
	const { reservation_id } = req.body;

	const cancelReservation = await prisma.reservations.update({
		where: {
			id: reservation_id
		},
		data: {
			is_cancelled: true
		}
	});

	console.log(cancelReservation);

	return res.json(cancelReservation);
});

module.exports = router;