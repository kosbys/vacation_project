import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./Components/Login.tsx";
import Register from "./Components/Register.tsx";
import Vacations from "./Components/Vacations.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Navigate to="/register" replace />,
  },
  {
    path: "register",
    element: <Register></Register>,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "vacations",
    element: <Vacations />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
