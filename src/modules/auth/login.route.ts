import { Router } from "express";
import { authController } from "./login.controller";

const router = Router();

router.post("/login", authController.loginUser);
export const loginRoute = router;