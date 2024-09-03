import { FC, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Switch,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Link, useNavigate } from "react-router-dom";
import { Logout, Settings } from "@mui/icons-material";
import { updateUserData } from "../../api/user.api";
import { setUserData } from "../../store/user/userReducer";
import notification from "../../configs/notification.config";
import { customLocalStorage } from "../../utils/customLocalStorage";

const slotProps = {
  paper: {
    elevation: 0,
    sx: {
      overflow: "visible",
      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
      mt: 1.5,
      "& .MuiAvatar-root": {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: "background.paper",
        transform: "translateY(-50%) rotate(45deg)",
        zIndex: 0,
      },
    },
  },
};

interface NavbarProps {
  toggleTheme: () => void;
}

const Navbar: FC<NavbarProps> = ({ toggleTheme }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { theme } = useSelector((state: RootState) => state.globalReducer);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const changeAdminMode = async (value: boolean) => {
    if (!user || user.role === "USER") {
      return;
    }
    try {
      const updatedData = await updateUserData({ adminMode: value });
      dispatch(setUserData(updatedData.user));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const stringToColor = (string: string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const stringAvatar = (fName: string = "", lName: string = "") => {
    const name = `${fName} ${lName}`;
    return {
      sx: {
        bgcolor: stringToColor(name),
        cursor: "pointer",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const formatText = (text: string): string => {
    return text
      .split("_") // Step 1: Split the string by underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Step 2-3: Capitalize first letter and convert the rest to lowercase
      .join(" "); // Step 4: Join words with a space
  };

  const handleLogout = () => {
    customLocalStorage.deleteData("user-token");
    dispatch(setUserData(null));
    handleClose();
    navigate("/signin");
  };

  return (
    <AppBar
      sx={{
        backgroundColor: theme === "light" ? "#5C6BC0" : "#272727",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ all: "unset", cursor: "pointer" }}>
            JS Practice
          </Link>
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={toggleTheme}>
            {theme === "dark" ? <DarkModeIcon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <Box>
          {user && (
            <Tooltip title="Account settings">
              <Avatar
                src={user.avatar ?? ""}
                {...stringAvatar(user?.firstName, user?.lastName)}
                onClick={handleClick}
              />
            </Tooltip>
          )}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            slotProps={slotProps}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            keepMounted
          >
            {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
              <MenuItem onClick={handleClose}>
                {formatText(user.role)} Mode
                <Switch
                  checked={user.adminMode}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => changeAdminMode(event.target.checked)}
                />
              </MenuItem>
            )}
            <Divider />
            <MenuItem>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
