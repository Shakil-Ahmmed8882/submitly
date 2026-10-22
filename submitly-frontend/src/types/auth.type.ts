export type TRole = "STUDENT" | "MENTOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: TRole;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
