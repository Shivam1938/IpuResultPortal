import { Router } from "express";

import { getChaptchaController } from "../controllers/getChaptcha.controller.js";

const router = Router();

router.get("/get-captcha", getChaptchaController); // http://localhost:3000/api/v1/get-captcha

export default router;
