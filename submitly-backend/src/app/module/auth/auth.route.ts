import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { LoginSchema, RegisterSchema } from "./auth.validation";

const router = Router();

router.post("/register", validateRequest(RegisterSchema), AuthController.register);
router.post("/login", validateRequest(LoginSchema), AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", auth("STUDENT", "MENTOR"), AuthController.me);

export const AuthRoutes = router;
