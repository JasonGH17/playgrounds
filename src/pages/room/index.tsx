import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Divider from '../../components/divider';
import { State } from '../../context';

import styles from './index.module.css';

const Room: NextPage = () => {
	const { room, name, socket } = useContext(State);

	const router = useRouter()

	const [players, setplayers] = useState<string[]>([]);
	const [admin, setadmin] = useState<string>('');
	const [messages, setmessages] = useState<
		Array<{ name: string; msg: string }>
	>([]);

	const [message, setmessage] = useState<string>('');

	useEffect(() => {
		socket.emit('join-room', { room, name });

		socket.on('update-player-list', (room: {players: string[], admin: string}) => {setplayers(room.players); setadmin(room.admin)});

		socket.on('new-msg', (msg: { name: string; msg: string }) =>
			setmessages((msgs) => [...msgs, msg])
		);

		socket.on('start-xo', () => {
			router.push('/xo')
		})

		return () => {
			socket.close();
		};
	}, [name, room]);

	function sendMsg() {
		socket.emit('new-msg', { name, msg: message });
		setmessage('');
	}

	function startxo() {
		socket.emit('start-xo', {name}, (fail: boolean) => {
			if(fail) alert("Failed to start XO")
			else router.push('/xo')
		})
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
				{admin === name && <button onClick={startxo}>Play XO</button>}
			</div>
		</>
	);
};

export default Room;
