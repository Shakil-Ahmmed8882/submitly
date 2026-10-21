export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "MENTOR";
  created_at: string;
  updated_at: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "STUDENT" | "MENTOR";
}

export interface LoginInput {
  email: string;
  password: string;
}
