import { DataTypes } from "sequelize";

export default function defineFilament(sequelize) {
	return sequelize.define(
		"Filament",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			brand: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			material: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			diameter: {
				type: DataTypes.DECIMAL(3, 2),
				allowNull: false,
				defaultValue: 1.75,
			},
			color: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			pricePerKg: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			timestamps: false,
		},
	);
}
