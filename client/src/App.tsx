import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext.tsx";
import Login from "./Components/Login.tsx";
import Register from "./Components/Register.tsx";
import Vacations from "./Components/Vacations.tsx";
import AddVacation from "./Components/AddVacation.tsx";
import EditVacation from "./Components/EditVacation.tsx";
import { Typography } from "@mui/material";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vacations" element={<Vacations />} />
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
