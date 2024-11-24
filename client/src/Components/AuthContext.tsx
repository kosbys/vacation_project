import { createContext, ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: string | null;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handleRegister: (form: RegisterForm) => Promise<boolean>;
  error: string | null;
};

type AuthProviderChildren = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderChildren) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setUser(jwtDecode(token));
      console.log(jwtDecode(token));
    }
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
        localStorage.setItem("jwt", res.data.token);
        return true;
      })
      .catch((err) => {
        setError(err.response.data.message);
        return false;
      });
  };

  const handleRegister = (form: RegisterForm) => {
    return axios
      .post("/register", form, {
        baseURL: "http://localhost:3000",
      })
      .then((res) => {
        setToken(res.data.token);
        localStorage.setItem("jwt", res.data.token);
        return true;
      })
      .catch((err) => {
        setError(err.response.data.message);
        return false;
      });
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleRegister, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
