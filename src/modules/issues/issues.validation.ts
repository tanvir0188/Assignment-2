import type { ICreateIssue, IUpdateIssue } from "./issues.interface";

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

export const validateUpdateIssuePayload = (
  payload: Partial<IUpdateIssue>,
): IUpdateIssue => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request payload");
  }

  const updateData: IUpdateIssue = {};

  // TITLE
  if (payload.title !== undefined) {
    const title = payload.title.toString().trim();

    if (!title) {
      throw new Error("Title cannot be empty");
    }

    if (title.length > 150) {
      throw new Error("Title must not exceed 150 characters");
    }

    updateData.title = title;
  }

  // DESCRIPTION
  if (payload.description !== undefined) {
    const description = payload.description.toString().trim();

    if (!description) {
      throw new Error("Description cannot be empty");
    }

    if (description.length < 20) {
      throw new Error("Description must be at least 20 characters");
    }

    updateData.description = description;
  }

  // TYPE
  if (payload.type !== undefined) {
    const type = payload.type.toString().trim().toLowerCase();

    if (!allowedIssueTypes.includes(type as any)) {
      throw new Error("Invalid type. Must be bug or feature_request");
    }

    if (payload.type !== undefined) {
    const type = payload.type.toString().trim().toLowerCase();

    if (!allowedIssueTypes.includes(type as any)) {
        throw new Error("Invalid type. Must be bug or feature_request");
      }

      updateData.type = type as "bug" | "feature_request";
      }
    }

  // prevent empty update
  if (Object.keys(updateData).length === 0) {
    throw new Error("At least one field must be provided for update");
  }

  return updateData;
};