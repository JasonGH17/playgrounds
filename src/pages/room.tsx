import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { State } from '../context';

const Room: NextPage = () => {
	const { room, name } = useContext(State);

	useEffect(() => {
		(async () => await fetch('/api/socket'))();
		const socket = io();
		socket.emit('join-room', { room, name });

		return () => {
			socket.close();
		};
	}, [name, room]);

	return (
		<>
			<Head>
				<title>Waiting room</title>
			</Head>
			<div>
				<h1>Waiting room</h1>
			</div>
		</>
	);
};

export default Room;
