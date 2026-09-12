import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from 'morgan';
import logger from './utils/logger.js';
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

// --- Next.js Style Custom Morgan Middleware ---
app.use(
  morgan((tokens, req, res) => {
    const status = parseInt(tokens.status(req, res), 10);

    // Status Code Colors
    const statusColor =
      status >= 500
        ? '\x1b[31m' // Red
        : status >= 400
          ? '\x1b[33m' // Yellow
          : status >= 300
            ? '\x1b[36m' // Cyan
            : '\x1b[32m'; // Green

    const reset = '\x1b[0m';
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const responseTime = tokens['response-time'](req, res);

    return [
      `\x1b[35m[API]\x1b[0m`,
      `\x1b[1m${method}\x1b[0m`,
      url,
      `${statusColor}${status}${reset}`,
      `- ${responseTime} ms`,
    ].join(' ');
  })
);

app.use("/api/v1", getChaptchaRouter);
app.use("/api/v1", loginRouter);
app.use("/api/v1", resultRoute);
app.use("/api/v1", forgetpwRoute);

export { app };
