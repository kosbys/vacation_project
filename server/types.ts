enum Role {
  user = "user",
  admin = "admin",
}

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Role;
};
