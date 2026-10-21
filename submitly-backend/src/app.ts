import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application, type Request, type Response } from "express";
import helmet from "helmet";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { globalLimiter } from "./app/middleware/rateLimiter";

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: config.client_url, credentials: true }));
app.use(globalLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", async (_req: Request, res: Response) => {
	res.status(httpStatus.OK).json({ success: true, status: "ok" });
});


app.use(globalErrorHandler);
app.use(notFound);

export default app;
