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
import { Link as RouterLink } from "react-router-dom";
import Joi from "joi";
import axios from "axios";
import { joiResolver } from "@hookform/resolvers/joi";
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

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
  } = useForm<FormData>({ resolver: joiResolver(validationSchema) });

  const [formError, setFormError] = useState({ error: false, message: "" });

  const onSubmit = async (data: FormData) => {
    await axios
      .post("http://localhost:3000/register", data)
      .then((res) => {
        console.log(res);
        console.log(res.data.token);

        // REDIRECT TO VACATIONS
      })
      .catch((err) => {
        setFormError({ error: true, message: err.response.data.message });
        reset();
      });
  };

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

      {formError.error && (
        <Alert sx={{ marginTop: "10px" }} severity="error">
          {formError.message}
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
