import { Router } from "express";
import {
	createFilament,
	deleteFilament,
	getAllFilaments,
	getFilamentNotPaginated,
	updateFilament,
} from "../controllers/filament.controllers.js";
import { validateFilamentBody } from "../middlewares/filament.middleware.js";

export const filamentRouter = Router();

filamentRouter.get("/", getAllFilaments);
filamentRouter.get("/not-paginated", getFilamentNotPaginated);
filamentRouter.post("/", validateFilamentBody, createFilament);
filamentRouter.put("/:id", validateFilamentBody, updateFilament);
filamentRouter.delete("/:id", deleteFilament);
