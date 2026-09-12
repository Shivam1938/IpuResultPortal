import { Router } from "express";
import { getResultController } from "../controllers/result.controller.js";

const router = Router();

router.post("/get-result", getResultController); // http://localhost:3000/api/v1/get-result

export default router;
