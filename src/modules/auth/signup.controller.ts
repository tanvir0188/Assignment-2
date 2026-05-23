import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { userService } from "./signup.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully!",
      data: result,
    });
  } catch (error: any) {
    const clientError = /already exists|required|Invalid|must|valid/i.test(
      error.message,
    );

    sendResponse(res, {
      statusCode: error.message.includes("already exists")
        ? 409
        : clientError
        ? 400
        : 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
};