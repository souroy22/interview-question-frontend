import { Box } from "@mui/material";
import Navbar from "../../components/Navbar";
import "./style.css";
import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <Box className="main-layout">
      <Navbar />
      <Box className="child-container">
        <Box sx={{ padding: "20px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default BaseLayout;
