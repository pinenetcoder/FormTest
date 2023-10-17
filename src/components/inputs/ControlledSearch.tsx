import { FC, useState } from "react";
import { TextField, styled } from "@mui/material";
import { UseFormRegister } from "react-hook-form";
import useDebounce from "../../hooks/useDebounce";

interface ISearch {
  searchAction: (search: string) => void;
  register: UseFormRegister<any>;
  name: string;
  type: string;
  placeholder: string;
  error?: string;
  maxWidth?: string;
  height?: string;
  maxHeight?: string;
  placeSearch?: boolean;
  disabled?: boolean;
}

const ControlledSearch: FC<ISearch> = ({
  searchAction,
  register,
  name,
  error,
  placeholder,
  disabled,
  type,
}) => {
  const controller = register(name, { valueAsNumber: type === "number" });
  const { search, onSearch } = useDebounce(searchAction, 700, "");

  const [shrink, setShrink] = useState(false);

  return (
    <StyledFormInput
      {...controller}
      label={placeholder}
      variant="outlined"
      disabled={disabled}
      error={!!error}
      helperText={error}
      fullWidth
      onChange={onSearch}
      onBlur={(e) => {
        if (e.target.value) return;
        setShrink(false);
      }}
      onFocus={() => {
        setShrink(true);
      }}
      InputLabelProps={{ shrink: shrink ?? Boolean(search) }}
    />
  );
};

export default ControlledSearch;

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
    "& .MuiInputBase-input": {
      paddingRight: "40px",
    },

    "& input.MuiInputBase-input:-internal-autofill-selected": {
      appearance: "menulist-button",
      backgroundImage: "none !important",
      backgroundColor: "red !important",
      color: "fieldtext !important",
    },

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
