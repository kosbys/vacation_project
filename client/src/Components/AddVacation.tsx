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
import { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadForm } from "../types";
import { AuthContext } from "./AuthContext";
import SuccessAlert from "./SuccessAlert";

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
  image: Joi.any().required().messages({
    "any.required": "Image is required",
  }),
});

export default function AddVacation() {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadForm>({
    resolver: joiResolver(validationSchema),
    defaultValues: { startDate: null, endDate: null },
  });

  const { handleUpload } = useContext(AuthContext)!;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dateError, setDateError] = useState(false);
  const [successAlert, setSuccessAlert] = useState({
    message: "",
    open: false,
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file, { shouldValidate: true });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  });

  const onSubmit: SubmitHandler<UploadForm> = async (data) => {
    if (dayjs(data.startDate).isBefore(data.endDate)) {
      setDateError(false);
      handleUpload(data);
      setSuccessAlert({
        message: "Successfully uploaded vacation",
        open: true,
      });
      reset();
    } else {
      setSuccessAlert({ message: "", open: false });
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
      <SuccessAlert
        handleClose={() => {
          setSuccessAlert({ message: "", open: false });
        }}
        message={successAlert.message}
        open={successAlert.open}
      />
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
                  label="End Date"
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
            Add Vacation
          </Button>

          {dateError && (
            <Alert severity="error">Start date must be before end date</Alert>
          )}
        </Stack>
      </form>
    </Box>
  );
}
