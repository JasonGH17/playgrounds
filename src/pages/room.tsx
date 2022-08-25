import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { State } from '../context';

const Room: NextPage = () => {
	const { room, name } = useContext(State);

	const [players, setplayers] = useState<string[]>([]);

	useEffect(() => {
		(async () => await fetch('/api/socket'))();
		const socket = io();
		socket.emit('join-room', { room, name });

		socket.on('update-player-list', (players: string[]) => {
			setplayers(players);
		});

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
				<h2>Code: {room}</h2>
				<h2>Players:</h2>
				<div>
					{players.map((player, index) => (
						<div key={index + '-player'}>
							<p>{player === name ? `${player} (Me)` : player}</p>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Room;
