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
  const getVacations = () => {
    return axios
      .get("/vacations", { baseURL: "http://localhost:3000" })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return [];
      });
  };

  const checkFollowingNumber = (vacation_id: number): Promise<number> => {
    return axios
      .get("/following_number", {
        baseURL: "http://localhost:3000",
        params: { vacation_id },
      })
      .then((res) => {
        return res.data.length;
      })
      .catch(() => {
        return 0;
      });
  };

  const checkFollowing = (
    user_id: number,
    vacation_id: number
  ): Promise<boolean> => {
    return axios
      .get("/following", {
        baseURL: "http://localhost:3000",
        params: { user_id, vacation_id },
      })
      .then((res) => {
        return res.data.length;
      })
      .catch(() => {
        return 0;
      });
  };

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
        setError(null);
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
        setError(null);
        return true;
      })
      .catch((err) => {
        setError(err.response.data.message);
        return false;
      });
  };
  const handleFollow = (vacation_id: number): Promise<boolean> => {
    return axios
      .post(
        "/follow",
        {
          user_id: user?.id,
          vacation_id,
        },
        { baseURL: "http://localhost:3000" }
      )
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleUnFollow = (vacation_id: number): Promise<boolean> => {
    return axios
      .delete("/unfollow", {
        baseURL: "http://localhost:3000",
        data: { user_id: user?.id, vacation_id },
      })
      .then(() => {
        return true;
      })
      .catch(() => {
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
        getVacations,
        setError,
        checkFollowing,
        checkFollowingNumber,
        handleLogin,
        handleRegister,
        handleFollow,
        handleUnFollow,
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
