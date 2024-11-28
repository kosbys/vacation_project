import { ReactNode } from "react";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
};

type Vacation = {
  id: number;
  destination: string;
  description: string;
  start_date: Date;
  end_date: Date;
  price: number;
  image_name: string;
  following: boolean;
};

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type VacationForm = {
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
  getVacations: () => Promise<Vacation[]>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  checkFollowing: (user_id: number, vacation_id: number) => Promise<boolean>;
  checkFollowingNumber: (vacation_id: number) => Promise<number>;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handleRegister: (form: RegisterForm) => Promise<boolean>;
  handleFollow: (vacation_id: number) => Promise<boolean>;
  handleUnFollow: (vacation_id: number) => Promise<boolean>;
  handleUpload: (form: VacationForm) => Promise<boolean>;
  handleDelete: (vacation_id: number) => Promise<boolean>;
  handleEdit: (
    form: VacationForm,
    vacation_id: number,
    imageEdited: boolean
  ) => Promise<boolean>;
  handleLogout: () => void;

  error: string | null;
};

type AuthProviderChildren = {
  children: ReactNode;
};

type Filters = {
  followed: boolean;
  upcoming: boolean;
  current: boolean;
};

export type {
  User,
  Vacation,
  RegisterForm,
  VacationForm,
  Filters,
  LoginForm,
  AuthContextType,
  AuthProviderChildren,
};
