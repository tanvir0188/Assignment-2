import { Router } from "express";
import { userController } from "./signup.controller";

const router = Router();

router.post("", userController.createUser);
export const userRoute = router;