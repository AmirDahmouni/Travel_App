import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { ChangeEvent, ChangeEventHandler } from 'react';


type PasswordInputProps = {
  password: string;
  label: string;
  handlePassword: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export default function PasswordInput({ password, handlePassword, label }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };


  return (
    <TextField
      size="medium"
      type={showPassword ? "text" : "password"}
      label={label}
      value={password}
      onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handlePassword(event)}
      required={true}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  );
}