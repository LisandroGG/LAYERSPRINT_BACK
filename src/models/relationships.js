export default function applyRelationships({
	Filament,
	Machine,
	Product,
	ProductFilament,
}) {
	Machine.hasMany(Product, { foreignKey: "machineId" });
	Product.belongsTo(Machine, { foreignKey: "machineId" });

	Product.belongsToMany(Filament, {
		through: ProductFilament,
		foreignKey: "productId",
		otherKey: "filamentId",
	});
	Filament.belongsToMany(Product, {
		through: ProductFilament,
		foreignKey: "filamentId",
		otherKey: "productId",
	});

	Product.hasMany(ProductFilament, { foreignKey: "productId" });
	ProductFilament.belongsTo(Product, { foreignKey: "productId" });

	Filament.hasMany(ProductFilament, { foreignKey: "filamentId" });
	ProductFilament.belongsTo(Filament, { foreignKey: "filamentId" });
}
