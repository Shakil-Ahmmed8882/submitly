import type { Response } from "express";
import config from "../../config";

const UNIT_MS: Record<string, number> = {
	s: 1000,
	m: 60 * 1000,
	h: 60 * 60 * 1000,
	d: 24 * 60 * 60 * 1000,
};

const toMilliseconds = (duration: string) => {
	const match = /^(\d+)([smhd])$/.exec(duration);
	if (!match) return UNIT_MS.d * 7;
	return Number(match[1]) * UNIT_MS[match[2]];
};

export const setAuthCookie = (res: Response, token: string) => {
	res.cookie("accessToken", token, {
		httpOnly: true,
		secure: config.node_env === "production",
		sameSite: "lax",
		maxAge: toMilliseconds(config.jwt_expires_in),
	});
};
