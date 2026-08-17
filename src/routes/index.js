import { Router } from "express";
import { filamentRouter } from "./filament.routes.js";
import { machineRouter } from "./machine.routes.js";
import { productRouter } from "./product.routes.js";
import { settingsRouter } from "./settings.routes.js";

export const mainRouter = Router();

mainRouter.get("/", (_req, res) => {
	res.send("Server Working");
});

mainRouter.use("/machines", machineRouter);
mainRouter.use("/filaments", filamentRouter);
mainRouter.use("/settings", settingsRouter);
mainRouter.use("/products", productRouter);
