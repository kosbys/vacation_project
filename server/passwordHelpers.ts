import bcrypt from "bcryptjs";

const hashPassword = (password: string): Promise<string> => {
  return bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt));
};

const comparePasswords = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePasswords };
