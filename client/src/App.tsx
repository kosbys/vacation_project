import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./Components/AuthContext.tsx";
import Login from "./Components/Login.tsx";
import Register from "./Components/Register.tsx";
import Vacations from "./Components/Vacations.tsx";
import AddVacation from "./Components/AddVacation.tsx";
import EditVacation from "./Components/EditVacation.tsx";
import { Typography } from "@mui/material";
import React, { useContext } from "react";

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { user } = useContext(AuthContext)!;

  return user ? element : <Navigate to="/register" />;
};

export default function App() {
  // make protected routes
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/vacations"
            element={<PrivateRoute element={<Vacations />} />}
          />
          <Route path="/addvacation" element={<AddVacation />} />
          <Route path="/editvacation" element={<EditVacation />} />
          <Route
            path="*"
            element={<Typography>ERROR 404 NOTHING IN THIS PAGE</Typography>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
