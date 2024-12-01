import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Vacation } from "../types";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function DeleteConfirm({
  open,
  onClose,
  vacation,
  refresh,
}: {
  open: boolean;
  onClose: () => void;
  vacation: Vacation;
  refresh: () => Promise<void>;
}) {
  const { handleDelete } = useContext(AuthContext)!;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete vacation to {vacation.destination}?
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={async () => {
            handleDelete(vacation.id).then(() => {
              refresh();
              onClose();
            });
          }}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
