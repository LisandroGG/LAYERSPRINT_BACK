import { Op } from "sequelize";
import { messages } from "../helpers/messages.js";
import { buildPagedResponse, getPagination } from "../helpers/pagination.js";
import { Filament } from "../models/index.js";

export const getAllFilaments = async (req, res) => {
	try {
		const { brand, material, diameter, color } = req.query;
		const { page, limit, offset } = getPagination(req.query, 9);

		const conditions = [];

		if (brand) {
			conditions.push({
				brand: { [Op.like]: `%${brand}%` },
			});
		}

		if (material) {
			conditions.push({
				material: { [Op.like]: `%${material}%` },
			});
		}

		if (diameter) {
			conditions.push({
				diameter: { [Op.like]: `%${diameter}%` },
			});
		}

		if (color) {
			conditions.push({
				color: { [Op.like]: `%${color}%` },
			});
		}

		const whereConditions =
			conditions.length > 0 ? { [Op.and]: conditions } : {};

		const { count: total, rows } = await Filament.findAndCountAll({
			where: whereConditions,
			limit,
			offset,
			order: [["id", "ASC"]],
		});
		res.status(200).json(buildPagedResponse(rows, total, page, limit));
	} catch (_error) {
		res.status(500).json({ error: messages.filament.getError });
	}
};

export const getFilamentNotPaginated = async (_req, res) => {
	try {
		const filaments = await Filament.findAll({
			order: [["id", "ASC"]],
		});
		res.status(200).json(filaments);
	} catch (_error) {
		res.status(500).json({ error: messages.filament.getError });
	}
};

export const createFilament = async (req, res) => {
	const { brand, material, diameter, color, pricePerKg } = req.body;
	try {
		const filament = await Filament.create({
			brand,
			material,
			diameter,
			color,
			pricePerKg,
		});
		res.status(201).json({
			filament,
			message: messages.filament.createSuccess,
		});
	} catch (_error) {
		res.status(500).json({ error: messages.filament.createError });
	}
};

export const updateFilament = async (req, res) => {
	const { id } = req.params;
	const { brand, material, diameter, color, pricePerKg } = req.body;
	try {
		const filament = await Filament.findByPk(id);
		if (!filament) {
			return res.status(404).json({ message: messages.filament.notFound });
		}
		await filament.update({ brand, material, diameter, color, pricePerKg });
		res.status(200).json({
			filament,
			message: messages.filament.updateSuccess,
		});
	} catch (_error) {
		res.status(500).json({ error: messages.filament.updateError });
	}
};

export const deleteFilament = async (req, res) => {
	const { id } = req.params;
	try {
		const filament = await Filament.findByPk(id);
		if (!filament) {
			return res.status(404).json({ message: messages.filament.notFound });
		}
		await filament.destroy();
		res.status(200).json({ message: messages.filament.deleteSuccess });
	} catch (_error) {
		res.status(500).json({ error: messages.filament.deleteError });
	}
};
