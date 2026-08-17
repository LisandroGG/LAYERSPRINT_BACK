export function calculateProductCost(product, kwhPrice) {
	const materialCost = product.ProductFilaments.reduce((total, pf) => {
		return (
			total + (Number(pf.gramsUsed) / 1000) * Number(pf.Filament.pricePerKg)
		);
	}, 0);

	const hours = Number(product.timeToPrint) / 60;
	const kwh = (Number(product.Machine.watts) / 1000) * hours;
	const energyCost = kwh * Number(kwhPrice);
	const machineCost = hours * Number(product.Machine.depreciationPerHour);

	const total =
		materialCost +
		energyCost +
		machineCost +
		Number(product.laborCost) +
		Number(product.extras);

	return {
		materialCost: Number(materialCost.toFixed(2)),
		energyCost: Number(energyCost.toFixed(2)),
		machineCost: Number(machineCost.toFixed(2)),
		total: Number(total.toFixed(2)),
	};
}
