import { Router } from "express";

import { loginController } from "../controllers/login.controller.js";

const router = Router();

router.post("/login", loginController); // http://localhost:3000/api/v1/login

export default router;
