import { ReactNode } from "react";

type User = {
  id: number;
  email: string;
  role: "user" | "admin";
};

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type UploadForm = {
  destination: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  price: string;
  image: File | null;
};

type LoginForm = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handleRegister: (form: RegisterForm) => Promise<boolean>;
  handleUpload: (form: UploadForm) => Promise<boolean>;
  handleLogout: () => void;
  error: string | null;
};

type AuthProviderChildren = {
  children: ReactNode;
};

export type {
  User,
  RegisterForm,
  UploadForm,
  LoginForm,
  AuthContextType,
  AuthProviderChildren,
};
