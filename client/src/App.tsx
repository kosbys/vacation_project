import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./Components/AuthContext.tsx";
import Login from "./Components/Login.tsx";
import Register from "./Components/Register.tsx";
import Vacations from "./Components/Vacations.tsx";
import AddVacation from "./Components/AddVacation.tsx";
import EditVacation from "./Components/EditVacation.tsx";
import React, { useContext } from "react";
import Header from "./Components/Header.tsx";
import NotFound from "./Components/NotFound.tsx";

const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { user } = useContext(AuthContext)!;

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
    <>
      <AuthProvider>
        <BrowserRouter>
          <Header />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
