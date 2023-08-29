const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const {getMallID} = require("./token");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	const { mall_id, id, number_plate, directory, entry_station_id, reservation_id } = req.body

	if(reservation_id == null) {
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

		for (let lot of vacantLots) {
			lot.distance = Math.abs(directory.lot_no - lot.lot_no) + (Math.abs(directory.floor_id - lot.floor_id) * 10);
		}

		vacantLots.sort((a, b) => {
			return a.distance - b.distance;
		});

		console.log(vacantLots);

		const createEntry = await prisma.parking_log.create({
			data: {
				user_id: id,
				number_plate_id: number_plate.id,
				entry_datetime: new Date(),
				directory_id: directory.id,
				entry_station_id: entry_station_id,
				lot_id: vacantLots?.[0]?.id,
			}
		});

		console.log(createEntry);

		return res.json({
			...createEntry,
			lot: vacantLots?.[0],
		});
	} else {
		const reservation = await prisma.reservations.findUnique({
			where: {
				id: reservation_id
			},
			include: {
				lot: true,
			}
		});

		const createEntry = await prisma.parking_log.create({
			data: {
				user_id: id,
				number_plate_id: number_plate.id,
				entry_datetime: new Date(),
				directory_id: reservation?.directory_id,
				entry_station_id: entry_station_id,
				lot_id: reservation?.lot_id,
				reservation_id: reservation_id,
			}
		});

		const updateReservation = await prisma.reservations.update({
			where: {
				id: reservation_id
			},
			data: {
				is_fulfilled: true,
			}
		});

		console.log(createEntry);

		return res.json({
			...createEntry,
			lot: reservation?.lot,
		});
	}
});

module.exports = router;