import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AUTH_SIGNIN_IMAGE from "../../assets/images/log.svg";
import AUTH_SIGNUP_IMAGE from "../../assets/images/register.svg";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";
import "./style.css";

const AuthLayout = () => {
  const [mode, setMode] = useState<boolean>(false);
  const theme = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/signup") {
      setMode(true);
    }
  }, [location.pathname]);

  return (
    <Box
      className={`container ${mode ? "sign-up-mode" : ""} ${
        theme.palette.mode === "dark" ? "dark-mode" : ""
      }`}
    >
      <Box className="forms-container">
        <Box className="signin-signup">
          <Outlet />
          <Box className="social-media">
            <a href="#" className="social-icon">
              <FcGoogle />
            </a>

            <a href="#" className="social-icon">
              <FaFacebook color="#106BFF" />
            </a>
          </Box>
        </Box>
      </Box>
      <Box className="panels-container">
        <Box className="panel left-panel">
          <Box className="content">
            <h3>Join Our Community!</h3>
            <p>
              Unlock the full experience by signing up with your details today.
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={() => {
                navigate("/signup");
                setMode(true);
              }}
            >
              Sign up
            </button>
          </Box>
          <img src={AUTH_SIGNIN_IMAGE} className="image" alt="" />
        </Box>
        <Box className="panel right-panel">
          <Box className="content">
            <h3>Welcome back!</h3>
            <p>Sign in to unlock your personalized experience.</p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={() => {
                navigate("/signin");
                setMode(false);
              }}
            >
              Sign in
            </button>
          </Box>
          <img src={AUTH_SIGNUP_IMAGE} className="image" alt="Sign up Image" />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
