import { Socket, Server } from 'net';
import { NextApiResponse } from 'next';
import { Server as SS } from 'socket.io';

type NextApiSocketResponse = NextApiResponse & {
	socket: Socket & {
		server: Server & {
			io: SS;
		};
	};
};

export default NextApiSocketResponse;
