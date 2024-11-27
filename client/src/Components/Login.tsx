import { useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  Link,
  Alert,
} from "@mui/material";
import { Navigate, Link as RouterLink, useNavigate } from "react-router-dom";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { LoginForm } from "../types";

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Please enter a valid email address",
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(4).required().messages({
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 4 characters long",
    "any.required": "Password is required",
  }),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: joiResolver(validationSchema) });
  const navigate = useNavigate();
  const { user, handleLogin, error } = useContext(AuthContext)!;

  const onSubmit = async (data: LoginForm) => {
    const success = await handleLogin(data.email, data.password);

    if (!success) {
      reset({}, { keepErrors: false });
    } else {
      navigate("/vacations");
    }
  };

  if (user) {
    return <Navigate to="/vacations" />;
  }

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        sx={{ textAlign: "center" }}
        color="primary"
        variant="h4"
        gutterBottom
      >
        Login
      </Typography>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            required
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            required
          />

          <Button
            size="large"
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            Login
          </Button>
        </Stack>
      </form>

      {error && (
        <Alert sx={{ marginTop: "10px" }} severity="error">
          {error}
        </Alert>
      )}

      <Typography
        sx={{
          display: "flex",
          paddingTop: "10px",
          fontSize: "22px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Don't have an account?
        <Link component={RouterLink} to="/register">
          Register
        </Link>
      </Typography>
    </Box>
  );
}
