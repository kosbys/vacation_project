import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function Header() {
  // use auth to customize header based on logged in status and role
  const { user } = useContext(AuthContext)!;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Vacation App
        </Typography>
        <Button color="inherit" component={Link} to="/vacations">
          Vacations
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Register
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Log in
        </Button>
      </Toolbar>
    </AppBar>
  );
}
