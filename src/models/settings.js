import { DataTypes } from "sequelize";

export default function defineSettings(sequelize) {
	return sequelize.define(
		"Settings",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			kwhPrice: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			timestamps: false,
		},
	);
}
