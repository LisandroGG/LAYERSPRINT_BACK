import { DataTypes } from "sequelize";

export default function defineMachine(sequelize) {
	return sequelize.define(
		"Machine",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			watts: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			depreciationPerHour: {
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
