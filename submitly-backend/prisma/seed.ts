import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const prisma = new PrismaClient();

const main = async () => {
	const mentorName = process.env.MENTOR_NAME!;
	const mentorEmail = process.env.MENTOR_EMAIL!;
	const mentorPassword = process.env.MENTOR_PASSWORD!;

	const hashedPassword = await bcrypt.hash(mentorPassword, 10);

	await prisma.user.upsert({
		where: { email: mentorEmail },
		update: {},
		create: {
			name: mentorName,
			email: mentorEmail,
			password: hashedPassword,
			role: "MENTOR",
		},
	});

	console.log(`Mentor account seeded: ${mentorEmail}`);
};

main()
	.catch((error) => {
		console.error("Seed failed:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
