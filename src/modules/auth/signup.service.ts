import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./signup.interface";
import { validateSignupPayload, type CreateUserPayload } from "./signup.validation";

const createUserIntoDB = async (payload: CreateUserPayload) => {
  const { name, email, password, role } = validateSignupPayload(payload);

  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email=$1`,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("A user with this email already exists");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
      INSERT INTO users(name, email, password, role)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `,
    [name, email, hashPassword, role],
  );

  delete result.rows[0].password;

  return result.rows[0];
};

export const userService = {
  createUserIntoDB,
};