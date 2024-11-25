import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Stack } from "@mui/material";

export default function Header() {
  const { user, handleLogout } = useContext(AuthContext)!;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }} variant="h5">
          Vacation App
        </Typography>

        {user ? (
          <Stack direction="row" spacing={2}>
            {user.role === "admin" ? (
              <>
                <Button
                  color="inherit"
                  variant="outlined"
                  component={Link}
                  to="/addvacation"
                >
                  Add Vacation
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  component={Link}
                  to="/report"
                >
                  Report
                </Button>
              </>
            ) : (
              ""
            )}
            <Button color="inherit" component={Link} to="/vacations">
              Vacations
            </Button>
            <Typography
              variant="subtitle2"
              sx={{ alignSelf: "center", textDecoration: "underline" }}
            >
              {user.role === "admin" ? "Admin" : ""}{" "}
              {`${user.firstName} ${user.lastName}`}
            </Typography>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        ) : (
          ""
        )}

        {!user ? (
          <Stack direction="row" spacing={2}>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Log in
            </Button>
          </Stack>
        ) : (
          ""
        )}
      </Toolbar>
    </AppBar>
  );
}
