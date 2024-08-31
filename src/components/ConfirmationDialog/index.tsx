import { Box, Button, Typography } from "@mui/material";
import Popup from "../Popup";

type PROP_TYPE = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
  conformBtnName?: string;
};

const ConfirmationPopup = ({
  open,
  onClose,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onConfirm,
  conformBtnName = "DELETE",
}: PROP_TYPE) => {
  return (
    <Popup open={open} onClose={onClose}>
      {title && (
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      {message && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          {conformBtnName}
        </Button>
      </Box>
    </Popup>
  );
};

export default ConfirmationPopup;
