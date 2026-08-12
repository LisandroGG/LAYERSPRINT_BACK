import { Router } from "express";
import { filamentRouter } from "./filament.routes.js";
import { machineRouter } from "./machine.routes.js";

export const mainRouter = Router();

mainRouter.get("/", (_req, res) => {
	res.send("Server Working");
});

mainRouter.use("/machines", machineRouter);
mainRouter.use("/filaments", filamentRouter);
