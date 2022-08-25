import { createContext } from 'react';

const ctx: {
	name: string;
	setName: (name: string) => void;
	room: string;
	setRoom: (room: string) => void;
} = {
	name: '',
	setName: function (name) {
		this.name = name;
	},
	room: '',
	setRoom: function (room) {
		this.room = room;
	},
};

const State = createContext(ctx);

export { State, ctx };
