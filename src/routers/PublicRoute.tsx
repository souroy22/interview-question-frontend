import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import LOGIN_GIF from "../assets/images/49bcfd78364175.5ca3009cb692f.gif";

const PublicRoute = () => {
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.userReducer);

  if (!user) {
    return (
      <Box sx={{ display: "flex" }}>
        <Box
          className="center-content"
          sx={{
            width: "50svw",
            height: "100%",
            display: { xs: "none", sm: "flex" },
          }}
        >
          <img src={LOGIN_GIF} width="400px" style={{ aspectRatio: "1/1" }} />
        </Box>
        <Outlet />
      </Box>
    );
  }
  return (
    <Navigate
      to={location.state?.prevUrl || "/"}
      state={{ prevUrl: location.pathname }}
    />
  );
};

export default PublicRoute;
