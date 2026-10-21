import type { Request, Response } from "express";
import httpStatus from "http-status";
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

	setAuthCookie(res, token);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Login successful",
		data: { user },
	});
});

export const AuthController = {
	register,
	login,
};
