import { Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import notification from "../../configs/notification.config";
import { signup } from "../../api/auth.api";
import { customLocalStorage } from "../../utils/customLocalStorage";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/user/userReducer";
import { FC } from "react";
import TextInput from "../../components/TextInput";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const formFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    StartIcon: FaUser,
    validation: (value: string) =>
      value.length >= 3 ? null : "Password must be at least 3 characters long",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    StartIcon: FaUser,
    validation: (value: string) =>
      value.length >= 3 ? null : "Password must be at least 3 characters long",
  },
  {
    name: "phone",
    label: "Contact Number",
    type: "text",
    required: true,
    StartIcon: FaPhoneAlt,
    validation: (value: string) =>
      value.length >= 10
        ? null
        : "Password must be at least 10 characters long",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    StartIcon: MdOutlineAlternateEmail,
    required: true,
    validation: (value: string) =>
      /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    StartIcon: RiLockPasswordFill,
    required: true,
    validation: (value: string) =>
      value.length >= 6 ? null : "Password must be at least 6 characters long",
  },
];

const Login: FC = () => {
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

  console.log("errors", errors);

  return (
    <form
      action="#"
      className="sign-up-form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleSignup);
      }}
    >
      <h2 className="title">Sign up</h2>
      {formFields.map((field) => (
        <TextInput
          key={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.label}
          required={true}
          error={errors[field.name] ?? ""}
          value={formData[field.name]}
          onChange={(event) => handleChange(field.name, event.target.value)}
          StartIcon={field.StartIcon}
        />
      ))}
      <Button
        type="submit"
        variant="contained"
        className={`btn ${loading ? "disabled" : ""}`}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress
            sx={{
              color: "white",
              width: "25px !important",
              height: "25px !important",
            }}
          />
        ) : (
          "Sign Up"
        )}
      </Button>
      <p className="social-text">Or Sign up with social platforms</p>
    </form>
  );
};

export default Login;
