import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from "@mui/material";
import useThemeMode from "./hooks/useThemeMode";
import RouterComponent from "./routers/router";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getUserData } from "./api/user.api";
import notification from "./configs/notification.config";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "./store/user/userReducer";

const App: React.FC = () => {
  const { toggleTheme, theme } = useThemeMode();

  const dispatch = useDispatch();

  const muiTheme = createTheme({
    palette: {
      mode: theme as "light" | "dark",
    },
  });

  const onLoad = async () => {
    try {
      const res = await getUserData();
      dispatch(setUserData(res.user));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Toaster />
      <BrowserRouter>
        <Navbar toggleTheme={toggleTheme} />
        <Container maxWidth="xl" className="homepage-container">
          <RouterComponent />
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
