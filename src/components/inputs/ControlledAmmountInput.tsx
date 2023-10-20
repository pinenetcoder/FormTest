import { Stack, styled } from "@mui/material";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Controller } from "react-hook-form";

export type TControllerInput = {
  name: string;
  label?: string;
  errors: any;
  control: any;
  disabled?: boolean;
  currentLanguage: string;
};

export const AmmountInput = ({
  name,
  label,
  control,
  disabled,
  errors,
  currentLanguage,
}: TControllerInput) => {
  const getFormErrorMessage = (name: string) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <StyledAmountContainer maxWidth="130px">
            <StyledAmountError className="p-float-label">
              <InputNumber
                disabled={disabled}
                value={field.value || null}
                onValueChange={(e: InputNumberValueChangeEvent) =>
                  field.onChange(e)
                }
                locale={currentLanguage}
                minFractionDigits={2}
                maxFractionDigits={2}
              />
              <label htmlFor="username">{label}</label>
            </StyledAmountError>
            {getFormErrorMessage(field.name)}
          </StyledAmountContainer>
        );
      }}
    />
  );
};

const StyledAmountContainer = styled(Stack)({
  position: "relative",

  "& .p-error": {
    position: "absolute",
    width: "300px",
    bottom: "-24px",
    right: 0,
    display: "flex",
    justifyContent: "flex-end",
  },

  "& .p-inputnumber": {
    width: "100%",

    "&.p-inputwrapper-focus + label": {
      padding: "0 4px",
      background: "#13232f",
      top: "3px",
      color: "#1ab188",
    },

    "&.p-inputwrapper-filled + label": {
      padding: "0 4px",
      background: "#13232f",
      top: "3px",
      color: "#1ab188",
    },

    "& .p-inputtext": {
      width: "100%",
      height: "56px",
      borderRadius: "12px",
      border: "1px solid #a0b3b0",
      background: "transparent",
      color: "#fff",

      "&:enabled:hover": {
        borderColor: "#1ab188",
      },

      "&:enabled:focus": {
        borderColor: "#1ab188",
        boxShadow: "none",
      },
    },
  },
});

const StyledAmountError = styled("span")({
  "& + small": {
    "@media (max-width: 400px)": {
      fontSize: "12px",
      bottom: "-18px",
    },
  },
});
