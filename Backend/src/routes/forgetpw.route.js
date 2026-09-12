import { Router } from "express";

import { forgetPasswordController } from "../controllers/forgetpw.controller.js";

const router = Router();

router.post("/forgot-password", forgetPasswordController); // http://localhost:3000/api/v1/forgot-password

export default router;