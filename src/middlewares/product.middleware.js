import { messages } from "../helpers/messages.js";

export const validateProductBody = (req, res, next) => {
	const { name, timeToPrint, laborCost, extras, machineId, filaments } =
		req.body;

	if (
		name === undefined ||
		timeToPrint === undefined ||
		machineId === undefined
	) {
		return res.status(400).json({ message: messages.global.missingFields });
	}

	if (typeof name !== "string") {
		return res.status(400).json({ message: messages.global.invalidFieldType });
	}

	if (Number.isNaN(Number(timeToPrint)) || Number.isNaN(Number(machineId))) {
		return res.status(400).json({ message: messages.global.invalidFieldType });
	}

	if (laborCost !== undefined && Number.isNaN(Number(laborCost))) {
		return res.status(400).json({ message: messages.global.invalidFieldType });
	}

	if (extras !== undefined && Number.isNaN(Number(extras))) {
		return res.status(400).json({ message: messages.global.invalidFieldType });
	}

	if (filaments) {
		try {
			const parsed = JSON.parse(filaments);
			if (!Array.isArray(parsed)) {
				return res
					.status(400)
					.json({ message: messages.global.invalidFieldType });
			}
		} catch {
			return res
				.status(400)
				.json({ message: messages.global.invalidFieldType });
		}
	}

	next();
};
