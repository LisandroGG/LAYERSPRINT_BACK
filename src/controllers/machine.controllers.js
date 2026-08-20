import { Op } from "sequelize";
import { messages } from "../helpers/messages.js";
import { buildPagedResponse, getPagination } from "../helpers/pagination.js";
import { Machine } from "../models/index.js";

export const getAllMachines = async (req, res) => {
	try {
		const { page, limit, offset } = getPagination(req.query, 9);
		const { search } = req.query;
		const where = search ? { name: { [Op.like]: `%${search}%` } } : undefined;

		const { count: total, rows } = await Machine.findAndCountAll({
			where,
			limit,
			offset,
			order: [["id", "ASC"]],
		});
		res.status(200).json(buildPagedResponse(rows, total, page, limit));
	} catch (_error) {
		res.status(500).json({ error: messages.machine.getError });
	}
};

export const getMachinesNoPaginated = async (_req, res) => {
	try {
		const machines = await Machine.findAll({
			order: [["id", "ASC"]],
		});
		res.status(200).json(machines);
	} catch (_error) {
		res.status(500).json({ error: messages.machine.getError });
	}
};

export const createMachine = async (req, res) => {
	const { name, watts, depreciationPerHour } = req.body;
	try {
		const machine = await Machine.create({ name, watts, depreciationPerHour });
		res.status(201).json({
			machine,
			message: messages.machine.createSuccess,
		});
	} catch (_error) {
		res.status(500).json({ error: messages.machine.createError });
	}
};

export const updateMachine = async (req, res) => {
	const { id } = req.params;
	const { name, watts, depreciationPerHour } = req.body;
	try {
		const machine = await Machine.findByPk(id);
		if (!machine) {
			return res.status(404).json({ message: messages.machine.notFound });
		}
		await machine.update({ name, watts, depreciationPerHour });
		res.status(200).json({
			machine,
			message: messages.machine.updateSuccess,
		});
	} catch (_error) {
		res.status(500).json({ error: messages.machine.updateError });
	}
};

export const deleteMachine = async (req, res) => {
	const { id } = req.params;
	try {
		const machine = await Machine.findByPk(id);
		if (!machine) {
			return res.status(404).json({ message: messages.machine.notFound });
		}
		await machine.destroy();
		res.status(200).json({ message: messages.machine.deleteSuccess });
	} catch (_error) {
		res.status(500).json({ error: messages.machine.deleteError });
	}
};
