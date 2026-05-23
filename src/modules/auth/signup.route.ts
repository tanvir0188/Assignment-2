import { Router } from "express";
import { userController } from "./signup.controller";

const router = Router();

router.post("/signup", userController.createUser);
export const signupRoute = router;