import { ReactNode } from "react";

import { MenuItem, TextField, styled } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { usFormattedNumber } from "../../utils/helpers";

interface IAccount {
  iban: string;
  id: string;
  balance: number;
}

interface IControllerSelect {
  name: string;
  label: string;
  error?: string;
  iconSettings?: { place?: string; icon?: ReactNode; text?: string };
  defaultValue: string;
  control: Control | any;
  selectOptions: Array<IAccount>;
  disabled: boolean;
  currentLanguage: string;
}

export const ControllerSelect = ({
  name,
  label,
  error,
  defaultValue,
  control,
  selectOptions,
  disabled,
  currentLanguage,
  ...rest
}: IControllerSelect) => {
  const list = selectOptions.map((item) => item.iban);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <StyledSelector
          {...rest}
          select
          label={label}
          fullWidth
          value={field.value}
          disabled={disabled}
          error={!!error}
          helperText={error}
          onBlur={field.onBlur}
          onChange={(e) => {
            field.onChange(e);
          }}
        >
          {list.map((option: string, idx: number) => (
            <MenuItem
              key={option}
              value={option}
              disabled={selectOptions[idx].balance < 0.01}
            >
              {option} (
              {usFormattedNumber(selectOptions[idx].balance, currentLanguage)})
            </MenuItem>
          ))}
        </StyledSelector>
      )}
    />
  );
};
const StyledSelector = styled(TextField)({
  "& .MuiSelect-select.MuiInputBase-input": {
    height: "3.5rem",
    boxSizing: "border-box",
  },

  "& label": {
    color: "#a0b3b0",

    "&.MuiInputLabel-shrink": {
      color: "#1ab188",
    },
  },

  "& .MuiInputBase-root": {
    "& .MuiSelect-select": {
      color: "#ffffff",
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
