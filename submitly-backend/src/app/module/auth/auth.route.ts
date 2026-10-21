import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { LoginSchema, RegisterSchema } from "./auth.validation";

const router = Router();

router.post("/register", validateRequest(RegisterSchema), AuthController.register);
router.post("/login", validateRequest(LoginSchema), AuthController.login);

export const AuthRoutes = router;
