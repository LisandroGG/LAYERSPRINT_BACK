import { Router } from "express";
import { upload } from "../config/multer.js";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	getProductsNoPaginated,
	updateProduct,
} from "../controllers/product.controllers.js";
import { validateProductBody } from "../middlewares/product.middleware.js";

export const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/not-paginated", getProductsNoPaginated);
productRouter.get("/:id", getProductById);
productRouter.post(
	"/",
	upload.single("image"),
	validateProductBody,
	createProduct,
);
productRouter.put(
	"/:id",
	upload.single("image"),
	validateProductBody,
	updateProduct,
);
productRouter.delete("/:id", deleteProduct);
