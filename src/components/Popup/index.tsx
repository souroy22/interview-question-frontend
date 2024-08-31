import { useRef } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type PopupProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string | number;
};

const Popup: React.FC<PopupProps> = ({
  open,
  onClose,
  children,
  width = 400,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <>
        <Box
          ref={modalRef}
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
            width,
            zIndex: 1200,
          }}
          onClick={handleModalClick}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          {children}
        </Box>

        {/* Background Overlay */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            backdropFilter: "blur(8px)", // Blur effect
            zIndex: 1000, // Behind the modal
          }}
        />
      </>
    </Modal>
  );
};

export default Popup;
