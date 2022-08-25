import { NextApiResponse, NextApiRequest } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<{ players: Array<string> } | null>
) {
	const { code, name } = req.body;

	const dbp = path.join(process.cwd(), './src/json/rooms.json');
	const db = JSON.parse(fs.readFileSync(dbp, { encoding: 'utf-8' }));

	if (!Object.keys(db).includes(code)) return res.status(404).end();
	if (!db[code].players.includes(name)) db[code].players.push(name);
	else return res.status(401).end();

	fs.writeFileSync(dbp, JSON.stringify(db, null, 2));

	res.status(200).json(db[code]);
}
