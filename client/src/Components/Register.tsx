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
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { RegisterForm } from "../types";

const validationSchema = Joi.object({
  firstName: Joi.string().max(30).required().messages({
    "string.empty": "First name is empty",
    "string.max": "First name is too long",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().max(30).required().messages({
    "string.empty": "Last name is empty",
    "string.max": "Last name is too long",
    "any.required": "Last name is required",
  }),
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

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: joiResolver(validationSchema) });
  const navigate = useNavigate();

  const { user, handleRegister, error, setError } = useContext(AuthContext)!;

  useEffect(() => {
    setError(null);
  }, [setError]);

  const onSubmit = async (data: RegisterForm) => {
    handleRegister(data);
    if (error) {
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
        Register
      </Typography>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="First name"
            variant="outlined"
            fullWidth
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            required
          />

          <TextField
            label="Last name"
            variant="outlined"
            fullWidth
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            required
          />

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
            Register
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
        Already a member?
        <Link component={RouterLink} to="/login">
          Login
        </Link>
      </Typography>
    </Box>
  );
}
