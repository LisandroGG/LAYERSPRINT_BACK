import { messages } from "../helpers/messages.js";

export const validateFilamentBody = (req, res, next) => {
	const { brand, material, diameter, color, pricePerKg } = req.body;

	if (!brand || !material || !diameter || !color || !pricePerKg) {
		return res.status(400).json({ message: messages.global.missingFields });
	}

	if (
		typeof brand !== "string" ||
		typeof material !== "string" ||
		typeof diameter !== "number" ||
		typeof color !== "string" ||
		typeof pricePerKg !== "number"
	) {
		return res.status(400).json({ message: messages.global.invalidFieldType });
	}

	next();
};
