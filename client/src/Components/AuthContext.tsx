import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  AuthContextType,
  AuthProviderChildren,
  User,
  RegisterForm,
  UploadForm,
} from "../types";

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

  const handleUpload = (form: UploadForm): Promise<boolean> => {
    return axios
      .post("/vacation", form, {
        baseURL: "http://localhost:3000",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
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
      value={{
        user,
        handleLogin,
        handleRegister,
        handleLogout,
        handleUpload,
        error,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
