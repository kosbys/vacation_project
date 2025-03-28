import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  AuthContextType,
  AuthProviderChildren,
  User,
  RegisterForm,
  VacationForm,
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
      .get("/vacations", { baseURL: "https://backend-8ydc.onrender.com" })
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
        baseURL: "https://backend-8ydc.onrender.com",
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
        baseURL: "https://backend-8ydc.onrender.com",
        params: { user_id, vacation_id },
      })
      .then((res) => {
        return res.data.length > 0;
      })
      .catch(() => {
        return false;
      });
  };

  const handleLogin = (email: string, password: string): Promise<boolean> => {
    return axios
      .post(
        "/login",
        { email, password },
        {
          baseURL: "https://backend-8ydc.onrender.com",
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
        baseURL: "https://backend-8ydc.onrender.com",
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
        { baseURL: "https://backend-8ydc.onrender.com" }
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
        baseURL: "https://backend-8ydc.onrender.com",
        data: { user_id: user?.id, vacation_id },
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const handleUpload = (form: VacationForm): Promise<boolean> => {
    return axios
      .post("/vacation", form, {
        baseURL: "https://backend-8ydc.onrender.com",
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

  const handleDelete = (vacation_id: number): Promise<boolean> => {
    return axios
      .delete("/vacation", {
        data: { vacation_id },
        baseURL: "https://backend-8ydc.onrender.com",
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };

  const handleEdit = (
    form: VacationForm,
    vacation_id: number,
    imageEdited: boolean
  ): Promise<boolean> => {
    if (imageEdited) {
      return axios
        .put(`/vacation/${vacation_id}`, form, {
          baseURL: "https://backend-8ydc.onrender.com",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    } else {
      return axios.put(`vacation/${vacation_id}`, form, {
        baseURL: "https://backend-8ydc.onrender.com",
      });
    }
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
        handleDelete,
        handleEdit,
        error,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
