type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

type Vacation = {
  id: number;
  destination: string;
  description: string;
  start_date: Date;
  end_date: Date;
  price: number;
  filename: string;
};

export type { User, Vacation };
