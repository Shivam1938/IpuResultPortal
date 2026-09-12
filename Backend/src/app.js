import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import getChaptchaRouter from "./routes/getChaptcha.route.js";
import loginRouter from "./routes/login.route.js";
import resultRoute from "./routes/result.route.js";
import forgetpwRoute from "./routes/forgetpw.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["ipu-session-id"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", getChaptchaRouter);
app.use("/api/v1", loginRouter);
app.use("/api/v1", resultRoute);
app.use("/api/v1", forgetpwRoute);

export { app };
