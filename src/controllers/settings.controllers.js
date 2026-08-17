import { Settings } from "../models/index.js";

export async function getSettings(_req, res) {
	const [settings] = await Settings.findOrCreate({
		where: { id: 1 },
		defaults: { kwhPrice: 0 },
	});
	res.json(settings);
}

export async function updateSettings(req, res) {
	const { kwhPrice } = req.body;

	const [settings] = await Settings.findOrCreate({
		where: { id: 1 },
		defaults: { kwhPrice: 0 },
	});

	await settings.update({ kwhPrice });
	res.json(settings);
}
