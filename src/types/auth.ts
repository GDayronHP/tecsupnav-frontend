export interface User {
  id: string;
  email: string;
  password: string | null;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "STUDENT";
  isActive: boolean;
  googleId: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserV2 {
  id: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  firstName: string;
  lastName: string;
}

export interface UserV3 {
  id: string,
  email: string,
  nombreCompleto: string,
  firstName: string,
  lastName: string,
  avatar: string | null,
  role: "ADMIN" | "STUDENT",
  createdAt: string,
}

export interface AuthResponseV1Data {
  user: User;
  access_token: string;
}
