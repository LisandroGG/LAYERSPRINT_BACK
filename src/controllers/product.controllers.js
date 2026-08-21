import { Op } from "sequelize";
import { deleteImage, uploadImage } from "../helpers/imageHelper.js";
import { messages } from "../helpers/messages.js";
import { buildPagedResponse, getPagination } from "../helpers/pagination.js";
import { calculateProductCost } from "../helpers/priceCalculator.js";
import {
	Filament,
	Machine,
	Product,
	ProductFilament,
	Settings,
	sequelize,
} from "../models/index.js";

const productIncludes = [
	{ model: Machine },
	{ model: ProductFilament, include: [Filament] },
];

async function getKwhPrice() {
	const [settings] = await Settings.findOrCreate({
		where: { id: 1 },
		defaults: { kwhPrice: 0 },
	});
	return settings.kwhPrice;
}

export const getAllProducts = async (req, res) => {
	try {
		const { page, limit, offset } = getPagination(req.query, 6);
		const { search } = req.query;
		const where = search ? { name: { [Op.like]: `%${search}%` } } : undefined;

		const { count: total, rows } = await Product.findAndCountAll({
			where,
			limit,
			offset,
			order: [["id", "ASC"]],
			include: productIncludes,
		});
		const kwhPrice = await getKwhPrice();
		const withCost = rows.map((product) => ({
			...product.toJSON(),
			cost: calculateProductCost(product, kwhPrice),
		}));
		res.status(200).json(buildPagedResponse(withCost, total, page, limit));
	} catch (_error) {
		res.status(500).json({ error: messages.product.getError });
	}
};

export const getProductsNoPaginated = async (_req, res) => {
	try {
		const products = await Product.findAll({
			order: [["id", "ASC"]],
			include: productIncludes,
		});
		res.status(200).json(products);
	} catch (_error) {
		res.status(500).json({ error: messages.product.getError });
	}
};

export const getProductById = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findByPk(id, { include: productIncludes });
		if (!product) {
			return res.status(404).json({ message: messages.product.notFound });
		}
		const kwhPrice = await getKwhPrice();
		res.status(200).json({
			...product.toJSON(),
			cost: calculateProductCost(product, kwhPrice),
		});
	} catch (_error) {
		res.status(500).json({ error: messages.product.getError });
	}
};

export const createProduct = async (req, res) => {
	const { name, timeToPrint, laborCost, extras, machineId } = req.body;
	const filaments = JSON.parse(req.body.filaments || "[]");
	const t = await sequelize.transaction();
	try {
		const weight = filaments.reduce(
			(total, f) => total + Number(f.gramsUsed),
			0,
		);

		let imageUrl = null;
		let imagePublicId = null;

		if (req.file) {
			const uploaded = await uploadImage(req.file.buffer, req.file.mimetype);
			imageUrl = uploaded.url;
			imagePublicId = uploaded.publicId;
		}

		const product = await Product.create(
			{
				name,
				weight,
				timeToPrint,
				laborCost,
				extras,
				machineId,
				imageUrl,
				imagePublicId,
			},
			{ transaction: t },
		);

		if (filaments.length) {
			await ProductFilament.bulkCreate(
				filaments.map((f) => ({
					productId: product.id,
					filamentId: f.filamentId,
					gramsUsed: f.gramsUsed,
				})),
				{ transaction: t },
			);
		}

		await t.commit();
		res.status(201).json({ product, message: messages.product.createSuccess });
	} catch (_error) {
		await t.rollback();
		res.status(500).json({ error: messages.product.createError });
	}
};

export const updateProduct = async (req, res) => {
	const { id } = req.params;
	const { name, timeToPrint, laborCost, extras, machineId } = req.body;
	const t = await sequelize.transaction();
	try {
		const product = await Product.findByPk(id);
		if (!product) {
			await t.rollback();
			return res.status(404).json({ message: messages.product.notFound });
		}

		if (req.file) {
			await deleteImage(product.imagePublicId);
			const uploaded = await uploadImage(req.file.buffer, req.file.mimetype);
			product.imageUrl = uploaded.url;
			product.imagePublicId = uploaded.publicId;
		}

		let weight = product.weight;

		if (req.body.filaments) {
			const filaments = JSON.parse(req.body.filaments);
			weight = filaments.reduce((total, f) => total + Number(f.gramsUsed), 0);

			await ProductFilament.destroy({
				where: { productId: product.id },
				transaction: t,
			});
			await ProductFilament.bulkCreate(
				filaments.map((f) => ({
					productId: product.id,
					filamentId: f.filamentId,
					gramsUsed: f.gramsUsed,
				})),
				{ transaction: t },
			);
		}

		await product.update(
			{ name, weight, timeToPrint, laborCost, extras, machineId },
			{ transaction: t },
		);

		await t.commit();

		const fullProduct = await Product.findByPk(product.id, {
			include: productIncludes,
		});
		const kwhPrice = await getKwhPrice();

		res.status(200).json({
			product: {
				...fullProduct.toJSON(),
				cost: calculateProductCost(fullProduct, kwhPrice),
			},
			message: messages.product.updateSuccess,
		});
	} catch (_error) {
		await t.rollback();
		res.status(500).json({ error: messages.product.updateError });
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findByPk(id);
		if (!product) {
			return res.status(404).json({ message: messages.product.notFound });
		}
		await deleteImage(product.imagePublicId);
		await ProductFilament.destroy({ where: { productId: product.id } });
		await product.destroy();
		res.status(200).json({ message: messages.product.deleteSuccess });
	} catch (_error) {
		res.status(500).json({ error: messages.product.deleteError });
	}
};
