import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import "./style.css";

const BaseLayout = () => {
  return (
    <Box className="main-layout">
      <Box className="child-container">
        <Box sx={{ padding: "20px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default BaseLayout;
