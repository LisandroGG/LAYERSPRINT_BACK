import { messages } from "../helpers/messages.js";

export const validateMachineBody = (req, res, next) => {
	const { name, watts, depreciationPerHour } = req.body;

	if (
		name === undefined ||
		watts === undefined ||
		depreciationPerHour === undefined
	) {
		return res.status(400).json({ message: messages.global.missingFields });
	}

	if (
		typeof name !== "string" ||
		typeof watts !== "number" ||
		typeof depreciationPerHour !== "number"
	) {
		return res.status(400).json({ message: messages.global.invalidFieldType });
	}

	next();
};
