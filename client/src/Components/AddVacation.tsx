import { useForm } from "react-hook-form";
import { Button, TextField, Typography, Stack, Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDropzone } from "react-dropzone";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";

// TODO : USE DROPZONE

interface FormData {
  destination: string;
  description: string;
  startDate: Date;
  endDate: Date;
  price: string;
  image: string;
}

const validationSchema = Joi.object({
  destination: Joi.string().required().messages({
    "string.empty": "Please enter a destination",
    "string.email": "Please enter a destination",
    "any.required": "Destination is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Please enter a description",
    "any.required": "Description is required",
  }),
  startDate: Joi.date().required().messages({
    "string.empty": "Please enter a start date",
    "any.required": "Start date is required",
  }),
  endDate: Joi.date().required().messages({
    "string.empty": "Please enter an end date",
    "any.required": "End date is required",
  }),
  price: Joi.number().min(1).max(10_000).required().messages({
    "number.base": "Price must be a valid number between 1-10,000",
    "number.min": "Price cannot be negative or zero",
    "number.max": "Price cannot be over 10,000",
    "number.empty": "Please enter a price",
    "any.required": "Price is required",
  }),
});

// TODO: EDIT

export default function AddVacation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: joiResolver(validationSchema) });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({});

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted", data);
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
        Add Vacation
      </Typography>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Desination"
            variant="outlined"
            fullWidth
            type="text"
            {...register("destination")}
            error={!!errors.destination}
            helperText={errors.destination?.message}
            required
          />

          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            maxRows={5}
            type="text"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            required
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              slotProps={{
                textField: {
                  error: !!errors.startDate,
                  helperText: errors.startDate?.message,
                },
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              slotProps={{
                textField: {
                  error: !!errors.endDate,
                  helperText: errors.endDate?.message,
                },
              }}
            />
          </LocalizationProvider>

          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            type="text"
            inputMode="numeric"
            {...register("price")}
            slotProps={{
              input: {
                inputProps: {
                  min: 0,
                  max: 10_000,
                  step: 1,
                },
              },
            }}
            onKeyDown={(e) => {
              if (isNaN(+e.key) && e.key != "Delete" && e.key != "Backspace") {
                e.preventDefault();
              }
            }}
            error={!!errors.price}
            helperText={errors.price?.message}
            required
          />

          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed",
              borderColor: isDragActive ? "primary.main" : "grey.400",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="h6" gutterBottom>
              {isDragActive
                ? "Drop the files here..."
                : "Drag & drop files here, or click to select"}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Select Files
            </Button>
          </Box>

          <Button
            size="large"
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            Add Vacation
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
