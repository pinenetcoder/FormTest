import { Box, Button, CircularProgress, styled } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Control, ErrorOption, useForm } from "react-hook-form";
import { onlinePaymentSchema } from "../../schemas/onlinePaymentSchema";
import { ControllerInput } from "../inputs/ControllerInput";
import { ControllerSelect } from "../inputs/ControllerSelect";
import { payerAccounts } from "../../data/accountDetails";
import { useEffect, useState } from "react";
import ControlledSearch from "../inputs/ControlledSearch";

export const BankTransferForm = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "lt" : "en";
    setCurrentLanguage(newLanguage);
  };

  const [selectedAccBalance, setSelectedAccBalance] = useState<
    number | undefined
  >(undefined);
  const [formSubmiting, setFormSubmiting] = useState(false);

  const checkMatch = (inputString: string) => {
    const pattern = /^LT\d{18}$/;
    return pattern.test(inputString);
  };

  const {
    handleSubmit,
    control,
    reset,
    watch,
    register,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(onlinePaymentSchema(Number(selectedAccBalance))),
    mode: "onChange",
    defaultValues: {
      payerAccount: "",
      amount: "",
      purpose: "",
      payeeAccount: "",
      payeeName: "",
    },
  });

  const watchedPayerAccount = watch("payerAccount");

  const onSubmit = async () => {
    setFormSubmiting(true);

    setTimeout(() => {
      setFormSubmiting(false);
      alert("Money successfuly transfered");
      reset();
    }, 2000);
  };

  const payeeAccountInputHandler = async (e: string) => {
    setValue("payeeAccount", e);

    if (checkMatch(e)) {
      setError("payeeAccount", "" as ErrorOption);
      const resp = await fetch(`https://matavi.eu/validate/?iban=${e}`);
      const data = await resp.json();
      if (data.valid) {
        alert("Account number you enterd is valid.");
        return;
      }
      alert("You've entered wrong bank account");
    } else {
      setError("payeeAccount", {
        type: "manual",
        message:
          "Invalid format. Please follow the format LT followed by 18 digits.",
      });
    }
  };

  useEffect(() => {
    const theOneBalance = payerAccounts.filter(
      (acc) => acc.iban === watchedPayerAccount
    )[0]?.balance;
    setSelectedAccBalance(theOneBalance);
  }, [watchedPayerAccount]);

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{ color: "#fff", cursor: "pointer", textTransform: "uppercase" }}
        onClick={handleChangeLanguage}
      >
        {currentLanguage}
      </Box>
      <StyledFormTitle>BANK TRANSFER</StyledFormTitle>
      <Box mb="1.5rem">
        <ControllerSelect
          name="payerAccount"
          selectOptions={payerAccounts}
          defaultValue=""
          control={control}
          label="Payer account"
          error={errors?.payerAccount?.message as string}
          disabled={formSubmiting}
          currentLanguage={currentLanguage}
        />
      </Box>
      <Box mb="1.5rem">
        <ControllerInput
          label="Transfer amount"
          name="amount"
          type="number"
          disabled={!selectedAccBalance || formSubmiting}
          error={errors?.amount?.message as string}
          control={control as unknown as Control}
        />
      </Box>
      <Box mb="1.5rem">
        <ControllerInput
          label="Transfer purpose"
          name="purpose"
          type="text"
          disabled={!selectedAccBalance || formSubmiting}
          error={errors?.purpose?.message as string}
          control={control as unknown as Control}
        />
      </Box>
      <Box mb="1.5rem">
        <ControlledSearch
          height="3.5rem"
          searchAction={payeeAccountInputHandler}
          name="payeeAccount"
          disabled={!selectedAccBalance || formSubmiting}
          type="text"
          register={register}
          placeholder="Payee account"
          error={errors?.payeeAccount?.message}
        />
      </Box>
      <Box mb="1.5rem">
        <ControllerInput
          label="Payee name"
          name="payeeName"
          type="text"
          disabled={!selectedAccBalance || formSubmiting}
          error={errors?.payeeName?.message as string}
          control={control as unknown as Control}
        />
      </Box>

      <StyledFormButton
        variant="outlined"
        type="submit"
        disabled={!selectedAccBalance || formSubmiting}
      >
        {formSubmiting ? (
          <CircularProgress size="1rem" color="inherit" sx={{ mr: "16px" }} />
        ) : null}
        SEND
      </StyledFormButton>
    </StyledForm>
  );
};

const StyledForm = styled("form")({
  background: "#13232f",
  width: "37.5rem",
  padding: "2.5rem",
  borderRadius: "0.5rem",
});

const StyledFormTitle = styled("h1")({
  color: "#ffffff",
  fontSize: "2.5rem",
  lineHeight: "4rem",
  marginBottom: "2rem",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "0.25rem",
});

const StyledFormButton = styled(Button)({
  height: "56px",
  width: "100%",
});
