import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  Alert,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import dayjs from "dayjs";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface FormData {
  destination: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  price: string;
  image: File | null;
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
  startDate: Joi.custom((value, helpers) => {
    if (!dayjs.isDayjs(value)) {
      return helpers.error("any.invalid");
    }
    if (!value.isValid()) {
      return helpers.error("date.invalid");
    }
    return value;
  })
    .required()
    .messages({
      "any.invalid": "Start date must be a valid date",
      "date.invalid": "Start date is invalid",
      "any.required": "Start date is required",
    }),
  endDate: Joi.custom((value, helpers) => {
    if (!dayjs.isDayjs(value)) {
      return helpers.error("any.invalid");
    }
    if (!value.isValid()) {
      return helpers.error("date.invalid");
    }
    return value;
  })
    .required()
    .messages({
      "any.invalid": "End date must be a valid date",
      "date.invalid": "End date is invalid",
      "date.greater": "End date must be after start date",
      "any.required": "End date is required",
    }),
  price: Joi.number().min(1).max(10_000).required().messages({
    "number.base": "Price must be a valid number between 1-10,000",
    "number.min": "Price cannot be negative or zero",
    "number.max": "Price cannot be over 10,000",
    "number.empty": "Please enter a price",
    "any.required": "Price is required",
  }),
  image: Joi.any(),
});

export default function EditVacation() {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: joiResolver(validationSchema),
    defaultValues: { startDate: null, endDate: null },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dateError, setDateError] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
      setValue("image", file, { shouldValidate: true }); // Set the file to the form state
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false, // Ensure only one file is allowed
    accept: {
      "image/*": [], // Restrict to images only
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (dayjs(data.startDate).isBefore(data.endDate)) {
      console.log(data);
      setDateError(false);
    } else {
      setDateError(true);
    }
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
        Edit Vacation
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
            type="text"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            required
          />

          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disablePast
                  label="Start Date"
                  {...field}
                  value={dayjs(field.value)}
                  onChange={(newValue) => field.onChange(newValue)}
                  slotProps={{
                    textField: {
                      error: !!errors.startDate,
                      helperText: errors.startDate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  disablePast
                  {...field}
                  value={dayjs(field.value)}
                  onChange={(newValue) => field.onChange(newValue)}
                  slotProps={{
                    textField: {
                      error: !!errors.endDate,
                      helperText: errors.endDate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />

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
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="body1">
              Drag & drop an image here, or click to select an image
            </Typography>
          </Box>

          {imagePreview && (
            <Box style={{ textAlign: "center" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  marginTop: "16px",
                }}
              />
            </Box>
          )}

          {errors.image && (
            <Typography color="error">{errors.image.message}</Typography>
          )}

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <input
                type="hidden"
                {...field}
                value={field.value ? (field.value as File).name : ""}
              />
            )}
          />

          <Button
            size="large"
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            Edit Vacation
          </Button>

          {dateError && (
            <Alert severity="error">Start date must be before end date</Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
}
