import type { Request, Response } from "express";
import type { IssueQuery } from "./issues.service";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporterId = Number(req.user?.id);

    if (!reporterId || Number.isNaN(reporterId)) {
      throw new Error("Invalid reporter id");
    }

    const result = await issueService.createIssue(req.body, reporterId);

    const issueWithReporter = {
      ...result,
      reporter: {
        id: reporterId,
        name: String(req.user?.name || ""),
        role: String(req.user?.role || ""),
      },
    };

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: issueWithReporter,
    });
  } catch (error: any) {
    const clientError = /required|Invalid|must|valid/i.test(error.message);
    sendResponse(res, {
      statusCode: clientError ? 400 : 500,
      success: false,
      message: error.message,
      error,
    });
  }
};

const getIssues = async (req: Request, res: Response) => {
  try {
    const sort =
      (req.query.sort as string)?.toLowerCase() === "oldest"
        ? "oldest"
        : "newest";

    const type = req.query.type
      ? (req.query.type as IssueQuery["type"])
      : undefined;

    const status = req.query.status
      ? (req.query.status as IssueQuery["status"])
      : undefined;

    const query: IssueQuery = {
      sort,
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
    };

    const result = await issueService.getIssues(query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    const clientError = /Invalid/.test(error.message);
    sendResponse(res, {
      statusCode: clientError ? 400 : 500,
      success: false,
      message: error.message,
      error,
    });
  }
};

export const issueController = {
  createIssue,
  getIssues,
};