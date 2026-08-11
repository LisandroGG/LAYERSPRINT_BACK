import { sequelize } from "../config/database.js";
import defineFilament from "./Filament.js";
import defineMachine from "./Machine.js";
import defineProduct from "./Product.js";
import defineProductFilament from "./ProductFilament.js";
import applyRelationships from "./relationships.js";

const Filament = defineFilament(sequelize);
const Machine = defineMachine(sequelize);
const Product = defineProduct(sequelize);
const ProductFilament = defineProductFilament(sequelize);

applyRelationships({ Filament, Machine, Product, ProductFilament });

export { Filament, Machine, Product, ProductFilament, sequelize };
