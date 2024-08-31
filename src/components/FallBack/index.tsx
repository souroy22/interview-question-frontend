import { Box, CircularProgress } from "@mui/material";
import "./style.css";

const FallBack = () => {
  return (
    <Box className="loader-container">
      <CircularProgress sx={{ zIndex: 10000 }} />
    </Box>
  );
};

export default FallBack;
