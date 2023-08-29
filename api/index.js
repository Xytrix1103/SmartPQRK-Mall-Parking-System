const path = require('path');
const PORT = process.env.PORT || 4000
const WS_PORT = 3000
const express = require('express')
const app = express()
const cors = require('cors')
const { Server } = require("socket.io");
const {getUserID} = require("./routes/token");

//attach websocket server to express
const httpServer = require("http").createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3000",
	},
});

httpServer.listen(WS_PORT, () => {
	console.log(`Socket.IO server running at http://localhost:${WS_PORT}/`);
});

io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	console.log("Token:", token);
	if (token) {
		if(token === "station") {
			socket.user = "station";
			return next();
		}
		socket.user = getUserID(token);
		console.log("User:", socket.user);
		return next();
	} else {
		console.error("No token");
		return next();
	}
});

io.on("connection", (socket) => {
	console.log("Client connected:", socket.id);
	const room = "user:" + socket.user;
	if(socket.user === "station") {
		socket.join("station");
	} else {
		socket.join(room);
	}

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});

	socket.on("entry-success-send", (data) => {
		console.log("entry-success-send to", data.user_id);
		console.log(data);
		io.to("user:" + data.user_id).emit("entry-success", data);
	});

	socket.on("exit-success-send", (data) => {
		console.log("exit-success-send to", data.user_id);
		console.log(data);
		io.to("user:" + data.user_id).emit("exit-success", data);
	});

	socket.on('entry-qrcode-warning-send', (data) => {
		console.log("entry-qrcode-warning-send to", data.id);
		io.to("user:" + data.id).emit("entry-qrcode-warning");
	});

	socket.on('exit-qrcode-warning-send', (data) => {
		console.log("entry-qrcode-warning-send to", data.id);
		io.to("user:" + data.id).emit("exit-qrcode-warning");
	});
});

app.use(cors())
app.use(express.json())

app.get('/api', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
	res.end("Hello World"); // Send directly
});
app.use('/api/login', require('./routes/login'))
app.use('/api/logout', require('./routes/logout'))
app.use('/api/token', require('./routes/token').router)
app.use('/api/directory', require('./routes/directory'))
app.use('/api/mall', require('./routes/mall'))
app.use('/api/users', require('./routes/users'))
app.use('/api/floors', require('./routes/floors'))
app.use('/api/wings', require('./routes/wings'))
app.use('/api/lots', require('./routes/lots'))
app.use('/api/admins', require('./routes/admins'))
app.use('/api/stations', require('./routes/stations'))
app.use('/api/entry', require('./routes/entry'))
app.use('/api/exit', require('./routes/exit'))
app.use('/api/reserve', require('./routes/reserve'))

//schedule the following code to run every minute
const cron = require('node-cron');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

cron.schedule('* * * * *', async () => {
	console.log('running a task every minute');

	const reservations = await prisma.reservations.findMany({
		where: {
			reservation_datetime: {
				lte: new Date(new Date().getTime() - 30 * 60000)
			},
			is_expired: false,
			is_fulfilled: null,
			is_cancelled: false
		},
	});

	console.log(reservations);

	for (const reservation of reservations) {
		const update = await prisma.reservations.update({
			where: {
				id: reservation.id
			},
			data: {
				is_expired: true
			}
		});

		console.log(update);
		console.log("reservation expired: ", reservation.user_id);

		io.to("user:" + reservation.user_id).emit("reservation-expired");
	}
});

app.listen(PORT, () => {
	console.log('Environment: ' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'production'))
	console.log('Server is running in port : ' + PORT)
})