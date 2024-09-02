import { Box, Tooltip } from "@mui/material";
import { IconType } from "react-icons";
import "./style.css";
import { ChangeEvent, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type PropTypes = {
  type: string;
  placeholder: string;
  name: string;
  error?: string | null;
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
  error = null,
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
          name={name}
          value={value}
          onChange={onChange}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={`${placeholder}${required ? "*" : ""}`}
          autoComplete="new-password"
        />
        {type === "password" && (
          <Tooltip title={`Click to ${showPassword ? "hide" : "show"}`}>
            <Box className="end-icon">
              {showPassword ? (
                <Visibility onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <VisibilityOff onClick={() => setShowPassword(!showPassword)} />
              )}
            </Box>
          </Tooltip>
        )}
      </Box>

      {error && <span className="error-message">{error}</span>}
    </>
  );
};

export default TextInput;
