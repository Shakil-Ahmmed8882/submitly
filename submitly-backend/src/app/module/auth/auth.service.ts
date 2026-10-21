import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { jwtUtils } from "../../utils/jwt";
import type { ILoginPayload, IRegisterPayload } from "./auth.interface";

const register = async (payload: IRegisterPayload) => {
	const email = payload.email.toLowerCase();

	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new AppError(httpStatus.CONFLICT, "Email already exists");
	}

	const hashedPassword = await bcrypt.hash(payload.password, 10);

	const user = await prisma.user.create({
		data: {
			name: payload.name,
			email,
			password: hashedPassword,
			role: "STUDENT",
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			created_at: true,
		},
	});

	return user;
};

const login = async (payload: ILoginPayload) => {
	const email = payload.email.toLowerCase();

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
	}

	const isPasswordValid = await bcrypt.compare(payload.password, user.password);
	if (!isPasswordValid) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
	}

	const token = jwtUtils.createToken(
		{ userId: user.id, role: user.role },
		config.jwt_secret,
		config.jwt_expires_in as any,
	);

	const { password: _, ...userWithoutPassword } = user;

	return { user: userWithoutPassword, token };
};

export const AuthService = {
	register,
	login,
};
