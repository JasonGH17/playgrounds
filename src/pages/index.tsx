import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useState } from 'react';
import Divider from '../components/divider';
import { State } from '../context';
import { useRouter } from 'next/router';

import styles from './index.module.css';

const Home: NextPage = () => {
	const global = useContext(State);

	const router = useRouter();

	const [code, setcode] = useState('');
	const [name, setname] = useState('');

	const joinRoom = () => {
		fetch('/api/room/join', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code, name }),
		})
			.then((res) => {
				if (res.ok) return res.json();
				alert('Invalid room code.');
			})
			.then((json) => {
				global.setRoom(json.code);
				global.setName(name);

				router.push('/room');
			});
	};

	const createRoom = () => {
		fetch('/api/room/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name }),
		})
			.then((res) => {
				if (res.ok) return res.text();
				alert('Invalid room code.');
			})
			.then((code) => {
				if (code === undefined)
					return alert('Something went wrong! Try again later.');
				global.setRoom(code);
				global.setName(name);

				router.push('/room');
			});
	};

	return (
		<>
			<Head>
				<title>Playgrounds</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles['home-main']}>
				<h1>Playgrounds</h1>
				<input
					placeholder="Username"
					value={name}
					onChange={(e) => setname(e.target.value)}
				/>
				<div className={styles['home-opts']}>
					<div className={styles['home-opt']}>
						<h2>Join a room</h2>
						<input
							placeholder="Room code"
							value={code}
							onChange={(e) => setcode(e.target.value)}
						/>
						<button onClick={joinRoom}>Join</button>
					</div>
					<Divider width={1} height={250} color="lightblue" />
					<div className={styles['home-opt']}>
						<button onClick={createRoom}>Create a new room</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
