import type { Response } from "express";
import config from "../../config";

export const setAuthCookie = (res: Response, token: string) => {
	res.cookie("accessToken", token, {
		httpOnly: true,
		secure: config.node_env === "production",
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};
