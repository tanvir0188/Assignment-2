import { Router } from "express";
import auth from "../../middleware/auth";
import { issueController } from "./issues.controller";

const router = Router();

router.post("/", auth("contributor", "maintainer"), issueController.createIssue);
router.get("/", issueController.getIssues);
router.get("/:id", issueController.getIssueById);
router.delete("/:id",auth("maintainer"), issueController.deleteIssue);
router.patch("/:id",auth("maintainer", "contributor"), issueController.updateIssue);

export const issueRoute = router;