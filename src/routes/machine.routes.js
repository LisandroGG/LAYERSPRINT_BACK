import { Router } from "express";
import {
	createMachine,
	deleteMachine,
	getAllMachines,
	getMachinesNoPaginated,
	updateMachine,
} from "../controllers/machine.controllers.js";
import { validateMachineBody } from "../middlewares/machine.middleware.js";

export const machineRouter = Router();

machineRouter.get("/", getAllMachines);
machineRouter.get("/not-paginated", getMachinesNoPaginated);
machineRouter.post("/", validateMachineBody, createMachine);
machineRouter.put("/:id", validateMachineBody, updateMachine);
machineRouter.delete("/:id", deleteMachine);
