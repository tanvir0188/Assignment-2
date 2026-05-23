import type { IUser } from "./signup.interface";

export type CreateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

const allowedRoles = ["contributor", "maintainer"];

const validateSignupPayload = (payload: CreateUserPayload): IUser => {
  
  const name = payload.name?.toString().trim();
  const email = payload.email?.toString().trim();
  const password = payload.password?.toString();
  const role = payload.role?.toString().trim().toLowerCase();

  if (!name) {
    throw new Error("Name is required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  if (!role) {
    throw new Error("Role is required");
  }

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role. Role must be contributor or maintainer");
  }

  return {
    name,
    email,
    password,
    role,
  };
};

export { validateSignupPayload, allowedRoles };