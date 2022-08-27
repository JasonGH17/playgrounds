import { NextApiRequest } from 'next';
import type NextApiSocketResponse from '../../../types/SocketResponse';
import fs from 'fs';
import path from 'path';

function randomCode(codes: Array<string>): string {
	let code = Math.random().toString(36).substring(5);
	if (codes.includes(code)) code = randomCode(codes);
	return code;
}

export default function handler(
	req: NextApiRequest,
	res: NextApiSocketResponse
) {
	const { name } = req.body;

	const dbp = path.join(process.cwd(), './src/json/rooms.json');
	const db = JSON.parse(fs.readFileSync(dbp, { encoding: 'utf-8' }));

	const code = randomCode(Object.keys(db));

	db[code] = { players: [name], admin: name };

	fs.writeFileSync(dbp, JSON.stringify(db, null, 2));

	res.status(201).send(code);
}
