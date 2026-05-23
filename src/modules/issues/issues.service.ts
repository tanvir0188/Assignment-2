import { pool } from "../../db";
import type { ICreateIssue, IIssue, IssueType, IssueStatus, IUpdateIssue } from "./issues.interface";
import { validateCreateIssuePayload } from "./issues.validation";

const createIssue = async (
  payload: Partial<ICreateIssue>,
  reporterId: number,
): Promise<IIssue> => {
  const { title, description, type } = validateCreateIssuePayload(payload);

  const result = await pool.query(
    `
      INSERT INTO issues(title, description, type, reporter_id)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

const allowedIssueTypes = ["bug", "feature_request"] as const;
const allowedStatuses = ["open", "in_progress", "resolved"] as const;

export type IssueQuery = {
  sort?: "newest" | "oldest";
  type?: IssueType;
  status?: IssueStatus;
};

const getIssues = async (query: IssueQuery): Promise<IIssue[]> => {
  const conditions: string[] = [];
  const values: Array<string> = [];

  if (query.type) {
    if (!allowedIssueTypes.includes(query.type)) {
      throw new Error("Invalid issue type filter");
    }
    values.push(query.type);
    conditions.push(`issues.type = $${values.length}`);
  }

  if (query.status) {
    if (!allowedStatuses.includes(query.status)) {
      throw new Error("Invalid status filter");
    }
    values.push(query.status);
    conditions.push(`issues.status = $${values.length}`);
  }

  const filters = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const sortDirection = query.sort === "oldest" ? "ASC" : "DESC";

  const result = await pool.query(
    `
      SELECT
        issues.*,
        users.name AS reporter_name,
        users.role AS reporter_role
      FROM issues
      JOIN users ON issues.reporter_id = users.id
      ${filters}
      ORDER BY issues.created_at ${sortDirection}
    `,
    values,
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    status: row.status,
    reporter_id: row.reporter_id,
    reporter: {
      id: row.reporter_id,
      name: row.reporter_name,
      role: row.reporter_role,
    },
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
};

const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM issues
      WHERE id = $1
      RETURNING *
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new Error("Issue not found");
  }

  return result.rows[0];
};

const getIssueById = async (id: string) => {
  const result = await pool.query(
    `
      SELECT
        issues.*,
        users.name AS reporter_name,
        users.role AS reporter_role
      FROM issues
      JOIN users ON issues.reporter_id = users.id
      WHERE issues.id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new Error("Issue not found");
  }

  const row = result.rows[0];

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    status: row.status,
    reporter: {
      id: row.reporter_id,
      name: row.reporter_name,
      role: row.reporter_role,
    },
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

const updateIssueInDB = async (
  id: string,
  payload: IUpdateIssue,
  user: { id: number; role: string }
) => {

  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );

  if (issueResult.rowCount === 0) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  const isMaintainer = user.role === "maintainer";
  const isOwner = issue.reporter_id === user.id;

  if (!isMaintainer) {
    if (!isOwner) {
      throw new Error("Forbidden: You can only update your own issues");
    }

    if (issue.status !== "open") {
      throw new Error("Cannot update issue unless status is open");
    }
  }

  const keys = Object.keys(payload);
  const values = Object.values(payload);

  if (keys.length === 0) {
    throw new Error("No valid fields to update");
  }

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const result = await pool.query(
    `
      UPDATE issues
      SET ${setClause},
          updated_at = NOW()
      WHERE id = $${keys.length + 1}
      RETURNING *
    `,
    [...values, id],
  );

  return result.rows[0];
};



export const issueService = {
  createIssue,
  getIssues,
  getIssueById,
  deleteIssueFromDB,
  updateIssueInDB
};