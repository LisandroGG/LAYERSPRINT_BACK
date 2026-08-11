import { DataTypes } from "sequelize";

export default function defineProductFilament(sequelize) {
	return sequelize.define(
		"ProductFilament",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			gramsUsed: {
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
