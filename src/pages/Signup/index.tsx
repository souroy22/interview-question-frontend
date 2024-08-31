import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import notification from "../../configs/notification.config";
import { signup } from "../../api/auth.api";
import { customLocalStorage } from "../../utils/customLocalStorage";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/user/userReducer";

const formFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    validation: (value: string) =>
      value.length >= 3 ? null : "Password must be at least 6 characters long",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    validation: (value: string) =>
      value.length >= 3 ? null : "Password must be at least 6 characters long",
  },
  {
    name: "phone",
    label: "Contact Number",
    type: "text",
    required: true,
    validation: (value: string) =>
      value.length >= 10 ? null : "Password must be at least 6 characters long",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    validation: (value: string) =>
      /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    validation: (value: string) =>
      value.length >= 6 ? null : "Password must be at least 6 characters long",
  },
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { formData, errors, loading, handleChange, handleSubmit } =
    useForm(formFields);

  const handleSignup = async (data: { [key: string]: string }) => {
    try {
      const res = await signup(data);
      customLocalStorage.setData("user-token", res.token);
      dispatch(setUserData(res.user));
      navigate(location.state?.prevUrl || "/");
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <Container
      maxWidth="xs"
      className="main-container"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
        marginLeft: 0,
      }}
    >
      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 4,
          padding: 2,
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 0 5px gray",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Signup Form
        </Typography>
        <Grid container spacing={2}>
          {formFields.map((field) => (
            <Grid item xs={12} key={field.name}>
              <TextField
                fullWidth
                name={field.name}
                label={field.label}
                type={field.type}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                variant="outlined"
                autoComplete="off"
                inputProps={{
                  autoComplete: "new-password",
                  form: {
                    autoComplete: "off",
                  },
                }}
                disabled={loading}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={() => handleSubmit(handleSignup)}
            fullWidth
          >
            Signup
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: "primary",
                position: "absolute",
                right: 10,
              }}
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Don't have an account?{" "}
          <Link href="#" onClick={handleNavigateToLogin}>
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
