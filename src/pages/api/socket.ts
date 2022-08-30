import type { Server as http } from 'http';
import { Server as SS } from 'socket.io';
import type { NextApiRequest } from 'next';
import type NextApiSocketResponse from '../../types/SocketResponse';

import path from 'path';
import fs from 'fs';

export default function handler(
	req: NextApiRequest,
	res: NextApiSocketResponse
) {
	if (!res.socket.server.io) {
		const server: http = res.socket.server as never; // i think works?
		const io = new SS(server);
		res.socket.server.io = io;

		const dbp = path.join(process.cwd(), './src/json/rooms.json');

		io.on('connection', (socket: any) => {
			console.log('New socket connected\nID:%s', socket.id);

			socket.on('join-room', (data: { name: string; room: string }) => {
				console.log('Socket %s connected to room %s', socket.id, data.room);
				socket.join(data.room);

				const db = JSON.parse(fs.readFileSync(dbp, { encoding: 'utf-8' }));
				io.to(data.room).emit('update-player-list', {players: db[data.room].players, admin: db[data.room].admin});

				socket.on('new-msg', (msg: { name: string; msg: string }) => {
					io.to(data.room).emit('new-msg', msg);
				});

				socket.on('start-xo', (msg: {name: string}, callback: (fail: boolean)=>void) => {
					if(db[data.room].admin === msg.name) {
						io.to(data.room).emit('start-xo');
						callback(false)
					} else callback(true)
				})

				socket.on('disconnect', () => {
					console.log("socket %s dc'ed", socket.id);

					const db = JSON.parse(fs.readFileSync(dbp, { encoding: 'utf-8' }));
					db[data.room].players = db[data.room].players.filter(
						(val: string) => val !== data.name
					);

					if (db[data.room].players.length == 0) delete db[data.room];

					fs.writeFileSync(dbp, JSON.stringify(db, null, 2));
				});
			});
		});
	}
	res.end();
}

export const config = {
	api: {
		bodyParser: false,
	},
};
