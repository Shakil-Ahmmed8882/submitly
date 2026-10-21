import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	node_env: process.env.NODE_ENV,
	port: process.env.PORT,
	database_url: process.env.DATABASE_URL,
	jwt_secret: process.env.JWT_SECRET!,
	jwt_expires_in: process.env.JWT_EXPIRES_IN!,
	client_url: process.env.CLIENT_URL,
	mentor_name: process.env.MENTOR_NAME,
	mentor_email: process.env.MENTOR_EMAIL,
	mentor_password: process.env.MENTOR_PASSWORD,
};
