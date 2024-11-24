import { createContext, ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handleRegister: (form: RegisterForm) => Promise<boolean>;
  handleLogout: () => void;
  error: string | null;
};

type AuthProviderChildren = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setUser(jwtDecode(token));
    }
    setLoading(false);
  }, [token]);

  const handleLogin = (email: string, password: string): Promise<boolean> => {
    return axios
      .post(
        "/login",
        { email, password },
        {
          baseURL: "http://localhost:3000",
        }
      )
      .then((res) => {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        return true;
      })
      .catch((err) => {
        setError(err.response.data.message);
        return false;
      });
  };

  const handleRegister = (form: RegisterForm): Promise<boolean> => {
    return axios
      .post("/register", form, {
        baseURL: "http://localhost:3000",
      })
      .then((res) => {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        return true;
      })
      .catch((err) => {
        setError(err.response.data.message);
        return false;
      });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, handleLogin, handleRegister, handleLogout, error }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
