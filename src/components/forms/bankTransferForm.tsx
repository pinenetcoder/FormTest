import { Box, Button, CircularProgress, Stack, styled } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Control, ErrorOption, useForm } from "react-hook-form";
import { onlinePaymentSchema } from "../../schemas/onlinePaymentSchema";
import { ControllerInput } from "../inputs/ControllerInput";
import { ControllerSelect } from "../inputs/ControllerSelect";
import { payerAccounts } from "../../data/accountDetails";
import { useEffect, useState } from "react";
import ControlledSearch from "../inputs/ControlledSearch";
import CheckIcon from "@mui/icons-material/Check";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import {
  accountValidityChecker,
  checkLTIBANMatch,
  tate,
} from "../../utils/helpers";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const BankTransferForm = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [selectedAccBalance, setSelectedAccBalance] = useState<
    number | undefined
  >(undefined);
  const [formSubmiting, setFormSubmiting] = useState(false);
  const [aproveAccountIcon, setAproveAccountIcon] = useState(false);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "lt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
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
    resolver: yupResolver(
      onlinePaymentSchema(Number(selectedAccBalance), tate, t, currentLanguage)
    ),
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
      setAproveAccountIcon(false);
      toast.success("Money successfuly transfered");
      reset();
    }, 2000);
  };

  const payeeAccountInputHandler = async (e: string) => {
    setValue("payeeAccount", e);

    if (checkLTIBANMatch(e)) {
      setError("payeeAccount", "" as ErrorOption);

      if (await accountValidityChecker(e)) {
        setAproveAccountIcon(true);
        return;
      }
    } else {
      setError("payeeAccount", {
        type: "manual",
        message: "Please follow the format LT followed by 18 digits.",
      });
      setAproveAccountIcon(false);
    }
  };

  // ZAKONCHI TRANSLATION i DOBAV STATE

  useEffect(() => {
    const theOneBalance = payerAccounts.filter(
      (acc) => acc.iban === watchedPayerAccount
    )[0]?.balance;
    setSelectedAccBalance(theOneBalance);
  }, [watchedPayerAccount]);

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <StyledLanguageSelector onClick={handleChangeLanguage}>
        {currentLanguage}
      </StyledLanguageSelector>
      <StyledFormTitle>{tate(t, "title")}</StyledFormTitle>

      <Stack
        flexDirection="row"
        mb="2rem"
        justifyContent="center"
        alignItems="center"
        sx={{ gap: "24px" }}
      >
        <StyledPayerBox>
          <StyledPayerBoxTitle>{tate(t, "payerBoxTitle")}</StyledPayerBoxTitle>
          <Stack flexDirection="row" mb="2rem" gap="10px" position="relative">
            <ControllerSelect
              name="payerAccount"
              selectOptions={payerAccounts}
              defaultValue=""
              control={control}
              label={tate(t, "payerAccountLabel")}
              error={errors?.payerAccount?.message as string}
              disabled={formSubmiting}
              currentLanguage={currentLanguage}
            />
            <ControllerInput
              label={tate(t, "transferAmountLabel")}
              name="amount"
              type="number"
              disabled={!selectedAccBalance || formSubmiting}
              error={errors?.amount?.message as string}
              control={control as unknown as Control}
              currentLanguage={currentLanguage}
              styles={{
                width: "130px",
                "& .MuiFormHelperText-root": {
                  position: "absolute",
                  width: "300px",
                  bottom: "-24px",
                  right: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                  mr: 0,
                },
              }}
            />
          </Stack>

          <Box>
            <ControllerInput
              label={tate(t, "transferPurposeLabel")}
              name="purpose"
              type="text"
              disabled={!selectedAccBalance || formSubmiting}
              error={errors?.purpose?.message as string}
              control={control as unknown as Control}
              currentLanguage={currentLanguage}
            />
          </Box>
        </StyledPayerBox>

        <StyledChevronIcon />

        <StyledPayerBox>
          <StyledPayerBoxTitle>{tate(t, "payeeBoxTitle")}</StyledPayerBoxTitle>
          <Box mb="2rem" position="relative">
            <ControlledSearch
              height="3.5rem"
              searchAction={payeeAccountInputHandler}
              name="payeeAccount"
              disabled={!selectedAccBalance || formSubmiting}
              type="text"
              register={register}
              placeholder={tate(t, "payeeAccountLabel")}
              error={errors?.payeeAccount?.message}
            />
            {aproveAccountIcon && <StyledCheckAccountNumberIcon />}
          </Box>

          <Box mb="2rem">
            <ControllerInput
              label={tate(t, "payeeNameLabel")}
              name="payeeName"
              type="text"
              disabled={!selectedAccBalance || formSubmiting}
              error={errors?.payeeName?.message as string}
              control={control as unknown as Control}
            />
          </Box>
        </StyledPayerBox>
      </Stack>
      <StyledFormButton
        variant="outlined"
        type="submit"
        disabled={!selectedAccBalance || formSubmiting}
      >
        {formSubmiting ? (
          <CircularProgress size="1rem" color="inherit" sx={{ mr: "16px" }} />
        ) : null}
        {tate(t, "sendButton")}
      </StyledFormButton>
    </StyledForm>
  );
};

const StyledForm = styled("form")({
  boxShadow: "0px 0px 20px 2px rgba(0,0,0,0.75)",
  width: "65rem",
  height: "100vh",
  padding: "2.5rem",
  borderRadius: "0.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
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
  borderRadius: "12px",

  "&:disabled": {
    border: "1px solid rgba(160, 179, 176, 0.4)",
    color: "#526267",
  },
});

const StyledPayerBox = styled(Box)({
  border: "1px solid #a0b3b0",
  background: "#13232f",
  borderRadius: "24px",
  width: "460px",
  height: "224px",
  padding: "40px 20px 24px",
  boxSizing: "border-box",
  position: "relative",
});

const StyledCheckAccountNumberIcon = styled(CheckIcon)({
  position: "absolute",
  right: "10px",
  top: "16px",
  color: "lime",
});
const StyledPayerBoxTitle = styled("h3")({
  margin: "0",
  position: "absolute",
  top: "10px",
  fontSize: "14px",
  textTransform: "uppercase",
  color: "#868686",
});

const StyledChevronIcon = styled(DoubleArrowIcon)({
  color: "#13232f",
  fontSize: "60px",
});

const StyledLanguageSelector = styled(Box)({
  color: "#13232f",
  fontWeight: "600",
  cursor: "pointer",
  textTransform: "uppercase",
  background: "#fff",
  width: "36px",
  height: "36px",
  borderRadius: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
