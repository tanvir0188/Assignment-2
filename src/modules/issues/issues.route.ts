import { Router } from "express";
import auth from "../../middleware/auth";
import { issueController } from "./issues.controller";

const router = Router();

router.post("/", auth("contributor", "maintainer"), issueController.createIssue);
router.get("/", issueController.getIssues);
router.delete("/:id",auth("maintainer"), issueController.deleteIssue);

export const issueRoute = router;