import { sequelize } from "../config/database.js";
import defineFilament from "./Filament.js";
import defineMachine from "./Machine.js";
import defineProduct from "./Product.js";
import defineProductFilament from "./ProductFilament.js";
import applyRelationships from "./relationships.js";
import defineSettings from "./settings.js";

const Filament = defineFilament(sequelize);
const Machine = defineMachine(sequelize);
const Product = defineProduct(sequelize);
const ProductFilament = defineProductFilament(sequelize);
const Settings = defineSettings(sequelize);

applyRelationships({ Filament, Machine, Product, ProductFilament, Settings });

export { Filament, Machine, Product, ProductFilament, Settings, sequelize };
