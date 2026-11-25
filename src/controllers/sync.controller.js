import {
	Machine,
	Product,
	Settings,
    ProductFilament,
    Filament
} from "../models/index.js";
import { calculateProductCost } from "../helpers/priceCalculator.js";

const productIncludes = [
	{ model: Machine },
	{ model: ProductFilament, include: [Filament] },
];

export const getGlobalSync = async (_req, res) => {
	try {
		const [settings] = await Settings.findOrCreate({
			where: { id: 1 },
			defaults: { kwhPrice: 0 },
		});

		const [products, machines] = await Promise.all([
			Product.findAll({
				order: [["id", "ASC"]],
				include: productIncludes,
			}),
			Machine.findAll({
				order: [["id", "ASC"]],
			}),
		]);

		const kwhPrice = settings.kwhPrice;

		const withCost = products.map((product) => ({
			...product.toJSON(),
			cost: calculateProductCost(product, kwhPrice),
		}));

		res.status(200).json({
			syncedAt: new Date().toISOString(),
			products: withCost,
			machines,
			settings: {
				kwhPrice,
			},
		});
	} catch (error) {
	console.error("Error en sincronización global:", error);

	res.status(500).json({
		error: "Error al realizar la sincronización global",
	});
	}
};