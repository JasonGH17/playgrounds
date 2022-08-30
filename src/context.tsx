import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const ctx: {
	name: string;
	setName: (name: string) => void;
	room: string;
	setRoom: (room: string) => void;
	socket: Socket
} = {
	name: '',
	setName: function (name) {
		this.name = name;
	},
	room: '',
	setRoom: function (room) {
		this.room = room;
	},
	socket: (() => {fetch('/api/socket'); return io()})()
};

const State = createContext(ctx);

export { State, ctx };
