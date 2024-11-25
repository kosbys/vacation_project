import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SuccessAlert({
  message,
  open,
  handleClose,
}: {
  message: string;
  open: boolean;
  handleClose: () => void;
}) {
  return (
    <div>
      <Snackbar open={open} onClose={handleClose} autoHideDuration={6000}>
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
