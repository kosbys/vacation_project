import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./Components/AuthContext.tsx";
import Login from "./Components/Login.tsx";
import Register from "./Components/Register.tsx";
import Vacations from "./Components/Vacations.tsx";
import AddVacation from "./Components/AddVacation.tsx";
import EditVacation from "./Components/EditVacation.tsx";
import { Typography } from "@mui/material";
import React, { useContext } from "react";

const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { user } = useContext(AuthContext)!;

  console.log(user);

  return user ? element : <Navigate to="/register" />;
};

const AdminRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { user } = useContext(AuthContext)!;

  if (user == null) {
    return <Navigate to="/register" />;
  }

  if (user.role === "admin") {
    return element;
  } else if (user.role === "user") {
    return <Navigate to="/vacations" />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<ProtectedRoute element={<Vacations />} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/vacations"
            element={<ProtectedRoute element={<Vacations />} />}
          />
          <Route
            path="/addvacation"
            element={<AdminRoute element={<AddVacation />} />}
          />
          <Route
            path="/editvacation"
            element={<AdminRoute element={<EditVacation />} />}
          />
          <Route
            path="*"
            element={<Typography>ERROR 404 NOTHING IN THIS PAGE</Typography>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
