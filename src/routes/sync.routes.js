import { Router } from "express";
import { getGlobalSync } from "../controllers/sync.controller.js";

export const syncRouter = Router();

syncRouter.get("/global", getGlobalSync);