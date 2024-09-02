import { FC, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { signin } from "../../api/auth.api";
import { customLocalStorage } from "../../utils/customLocalStorage";
import { setUserData } from "../../store/user/userReducer";
import notification from "../../configs/notification.config";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineAlternateEmail } from "react-icons/md";
import TextInput from "../../components/TextInput";
import useForm from "../../hooks/useForm";

const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formFields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      StartIcon: MdOutlineAlternateEmail,
      validation: (value: string) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      StartIcon: RiLockPasswordFill,
      validation: (value: string) =>
        value.length >= 6
          ? null
          : "Password must be at least 6 characters long",
    },
  ];

  const { formData, errors, handleChange, handleSubmit } = useForm(formFields);

  const handleSignin = async (data: { [key: string]: string }) => {
    setLoading(true);
    try {
      const res = await signin(data);
      customLocalStorage.setData("user-token", res.token);
      dispatch(setUserData(res.user));
      navigate(
        location.state?.prevUrl && location.state.prevUrl !== "/signin"
          ? location.state.prevUrl
          : "/"
      );
      notification.success("Signed in successfully");
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  console.log("formData", formData);

  return (
    <form
      action="#"
      className="sign-in-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleSignin);
      }}
    >
      <h2 className="title">Sign in</h2>
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
          "Sign In"
        )}
      </Button>
      <p className="social-text">Or Sign in with social platforms</p>
    </form>
  );
};

export default Login;
