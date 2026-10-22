import type { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "./auth.utils";

const register = catchAsync(async (req: Request, res: Response) => {
	const user = await AuthService.register(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Account created successfully",
		data: { user },
	});
});

const login = catchAsync(async (req: Request, res: Response) => {
	const { user, token } = await AuthService.login(req.body);

	setAuthCookie(res, token, user.role);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Login successful",
		data: { user },
	});
});

const logout = catchAsync(async (_req: Request, res: Response) => {
	res.cookie("accessToken", "", {
		httpOnly: true,
		secure: config.node_env === "production",
		sameSite: "lax",
		maxAge: 0,
	});
	res.cookie("role", "", {
		httpOnly: false,
		secure: config.node_env === "production",
		sameSite: "lax",
		maxAge: 0,
	});

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Logged out successfully",
		data: null,
	});
});

const me = catchAsync(async (req: Request, res: Response) => {
	const user = await AuthService.me(req.user!.userId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User retrieved successfully",
		data: { user },
	});
});

export const AuthController = {
	register,
	login,
	logout,
	me,
};
