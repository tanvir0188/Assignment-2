import type { ICreateIssue } from "./issues.interface";

const allowedIssueTypes = ["bug", "feature_request"] as const;

type AllowedIssueType = (typeof allowedIssueTypes)[number];

export const validateCreateIssuePayload = (
  payload: Partial<ICreateIssue>,
): ICreateIssue => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request payload");
  }

  const title = payload.title?.toString().trim();
  const description = payload.description?.toString().trim();
  const type = payload.type?.toString().trim().toLowerCase() as AllowedIssueType;

  if (!title) {
    throw new Error("Title is required");
  }

  if (title.length > 150) {
    throw new Error("Title must not contain over 150 characters");
  }

  if (!description) {
    throw new Error("Description is required");
  }
  if(description.length <20){
    throw new Error("Description must be over 20 characters")
  }

  if (!type) {
    throw new Error("Type is required");
  }

  if (!allowedIssueTypes.includes(type)) {
    throw new Error("Invalid type. Type must be bug or feature");
  }

  return {
    title,
    description,
    type,
  };
};