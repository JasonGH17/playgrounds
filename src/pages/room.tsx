import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Divider from '../components/divider';
import { State } from '../context';

import styles from './room.module.css';

const Room: NextPage = () => {
	const { room, name } = useContext(State);

	const [socket, setsocket] = useState<Socket>();

	const [players, setplayers] = useState<string[]>([]);
	const [messages, setmessages] = useState<
		Array<{ name: string; msg: string }>
	>([]);

	const [message, setmessage] = useState<string>('');

	useEffect(() => {
		(async () => await fetch('/api/socket'))();

		const socket = io();
		socket.emit('join-room', { room, name });

		socket.on('update-player-list', (players: string[]) => setplayers(players));

		socket.on('new-msg', (msg: { name: string; msg: string }) =>
			setmessages((msgs) => [...msgs, msg])
		);

		setsocket(socket);

		return () => {
			socket?.close();
		};
	}, [name, room]);

	function sendMsg() {
		socket?.emit('new-msg', { name, msg: message });
		setmessage('');
	}

	return (
		<>
			<Head>
				<title>Waiting room</title>
			</Head>
			<div>
				<h1>Waiting room</h1>
				<h2>Code: {room}</h2>
				<div className={styles.menu}>
					<div className={styles.chat}>
						<h3>Room chat</h3>
						<div>
							<div>
								{messages.map((msg, index) => (
									<div key={index + '-msg'}>
										<p>
											<b>{msg.name}:</b> {msg.msg}
										</p>
									</div>
								))}
							</div>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									sendMsg();
								}}
							>
								<input
									value={message}
									onChange={(e) => setmessage(e.target.value)}
									placeholder="Message"
								/>
								<input value="Send" type="submit" />
							</form>
						</div>
					</div>
					<Divider color="lightblue" width={1} height={400} />
					<div>
						<h2>Players:</h2>
						{players.map((player, index) => (
							<div key={index + '-player'}>
								<p>{player === name ? `${player} (Me)` : player}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default Room;
