import { TextField, styled } from "@mui/material";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";

export type TControllerInput = {
  name: string;
  control: Control;
  label?: string;
  error: string;
  type: string;
  disabled?: boolean;
  currentLanguage?: string;
};

export const ControllerInput = ({
  control,
  name,
  label,
  type,
  error,
  disabled,
}: TControllerInput) => {
  const [labelState, setLabelState] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <StyledFormInput
          fullWidth
          disabled={disabled}
          error={!!error}
          helperText={error}
          type={type ? type : "text"}
          onChange={(e) => {
            onChange(e);
          }}
          onFocus={() => {
            setLabelState(true);
          }}
          onBlur={(e) => {
            if (e.target.value === "") setLabelState(false);
          }}
          InputLabelProps={{ shrink: labelState }}
          value={value}
          label={label}
        />
      )}
    />
  );
};

const StyledFormInput = styled(TextField)({
  "& label": {
    color: "#a0b3b0",

    "&.Mui-disabled": {
      color: "rgba(160,179,176,0.4)",
    },

    "&.MuiInputLabel-shrink": {
      color: "#1ab188",
    },
  },

  "& .MuiFormHelperText-root": {
    position: "absolute",
    bottom: "-24px",
  },

  "& .MuiInputBase-root": {
    "&.Mui-disabled": {
      "& fieldset": {
        borderColor: "rgba(160,179,176,0.4)",
      },

      "&:hover fieldset": {
        borderColor: "rgba(160,179,176,0.4)",
      },
    },

    "&:hover fieldset": {
      borderColor: "#1ab188",
    },

    "& input": {
      color: "#ffffff",
    },

    "& fieldset": {
      border: "1px solid #a0b3b0",
      borderRadius: "12px",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#1ab188",
    },
  },
});
