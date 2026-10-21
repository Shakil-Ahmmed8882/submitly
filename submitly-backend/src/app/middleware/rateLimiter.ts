import rateLimit from "express-rate-limit";
import httpStatus from "http-status";

export const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (_req, res) => {
		res.status(httpStatus.TOO_MANY_REQUESTS).json({
			success: false,
			statusCode: httpStatus.TOO_MANY_REQUESTS,
			message: "Too many requests. Please try again later.",
		});
	},
});

export const submissionLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 3,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => req.user?.userId ?? req.ip ?? "unknown",
	handler: (_req, res) => {
		res.status(httpStatus.TOO_MANY_REQUESTS).json({
			success: false,
			statusCode: httpStatus.TOO_MANY_REQUESTS,
			message: "You can only submit 3 projects per 15 minutes. Please try again later.",
		});
	},
});
