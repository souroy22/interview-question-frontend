import { Box } from "@mui/material";
import { ErrorMessage } from "@hookform/error-message";
import { IconType } from "react-icons";
import "./style.css";
import { ChangeEvent, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type PropTypes = {
  type: string;
  placeholder: string;
  name: string;
  errors: any;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  StartIcon?: IconType | null;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const TextInput = ({
  type = "text",
  placeholder,
  name,
  errors,
  required = false,
  StartIcon = null,
  value,
  onChange,
}: PropTypes) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <Box
        className={`input-field ${type === "password" ? "with-end-icon" : ""}`}
      >
        {StartIcon && (
          <Box className="start-icon">
            <StartIcon />
          </Box>
        )}
        <input
          value={value}
          onChange={onChange}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={`${placeholder}${required ? "*" : ""}`}
          autoComplete="off"
        />
        {type === "password" && (
          <Box className="end-icon">
            {showPassword ? (
              <Visibility onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <VisibilityOff onClick={() => setShowPassword(!showPassword)} />
            )}
          </Box>
        )}
      </Box>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <span className="error-message">{message}</span>
        )}
      />
    </>
  );
};

export default TextInput;
