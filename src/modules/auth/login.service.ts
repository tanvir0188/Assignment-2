import bcrypt from "bcryptjs";
import { pool } from "../../db/index";

import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  console.log(payload)
  const { email, password } = payload;

  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  if (userData.rows.length === 0) {
    throw new Error("No user found with the given email");
  }

  // 2. Compare the password -> Done
  const userInfo = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, userInfo.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  //3. Generate Token
  const jwtpayload = {
    id: userInfo.id,
    name: userInfo.name,
    role: userInfo.role,

  };

  const user = {
    id:userInfo.id,
    name:userInfo.name,
    email:userInfo.email,
    role:userInfo.role,
    created_at:userInfo.created_at,
    updated_at:userInfo.updated_at
  }

  const accessToken = jwt.sign(jwtpayload, config.secret as string, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jwtpayload, config.refresh_secret as string, {
    expiresIn: "10d",
  });

  return { accessToken, user };
};



export const authService = {
  loginUserIntoDB,

};