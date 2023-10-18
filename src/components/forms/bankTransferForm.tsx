import { Box, Button, CircularProgress, Stack, styled } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Control, ErrorOption, useForm } from "react-hook-form";
import { onlinePaymentSchema } from "../../schemas/onlinePaymentSchema";
import { ControllerInput } from "../inputs/ControllerInput";
import { ControllerSelect } from "../inputs/ControllerSelect";
import { useEffect, useState } from "react";
import ControlledSearch from "../inputs/ControlledSearch";
import CheckIcon from "@mui/icons-material/Check";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import {
  accountValidityChecker,
  checkLTIBANMatch,
  tate,
  usFormattedNumber,
} from "../../utils/helpers";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../store/accounts/accounts.slice";

export const BankTransferForm = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [selectedAccount, setSelectedAccount] = useState<{
    iban: string;
    id: string;
    balance: number;
  }>({
    iban: "",
    id: "",
    balance: 0,
  });
  const [formSubmiting, setFormSubmiting] = useState(false);
  const [aproveAccountIcon, setAproveAccountIcon] = useState(false);

  const { accounts } = useSelector((state) => state);
  const dispatch = useDispatch();

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
      onlinePaymentSchema(
        Number(selectedAccount?.balance),
        tate,
        t,
        currentLanguage
      )
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
  const watchedAmount = watch("amount");

  const onSubmit = async (data: { payerAccount: any; amount: any }) => {
    dispatch(
      actions.getFromAccount({
        account: data.payerAccount,
        amount: data.amount,
      })
    );
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

  useEffect(() => {
    const selectedAcc = accounts.filter(
      (acc: { iban: string }) => acc.iban === watchedPayerAccount
    )[0];
    setSelectedAccount(selectedAcc);
  }, [watchedPayerAccount, accounts]);

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <StyledLanguageSelector onClick={handleChangeLanguage}>
        {currentLanguage}
      </StyledLanguageSelector>
      <StyledFormTitle>{tate(t, "title")}</StyledFormTitle>

      <StyledCardsStack>
        <StyledPayerBox>
          <StyledPayerBoxTitle>{tate(t, "payerBoxTitle")}</StyledPayerBoxTitle>
          <Stack flexDirection="row" mb="2rem" gap="10px" position="relative">
            <ControllerSelect
              name="payerAccount"
              selectOptions={accounts}
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
              disabled={!selectedAccount?.balance || formSubmiting}
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
              disabled={!selectedAccount?.balance || formSubmiting}
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
              disabled={!selectedAccount?.balance || formSubmiting}
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
              disabled={!selectedAccount?.balance || formSubmiting}
              error={errors?.payeeName?.message as string}
              control={control as unknown as Control}
            />
          </Box>
        </StyledPayerBox>
      </StyledCardsStack>

      <StyledCardsStack
        flexDirection="row"
        justifyContent={selectedAccount ? "space-between" : "flex-end"}
      >
        {selectedAccount && (
          <StyledTotalSection>
            <StyledDataLine>
              Available amount:{" "}
              {usFormattedNumber(
                Math.floor((selectedAccount.balance / 1.02) * 100) / 100,
                language
              )}
            </StyledDataLine>
            <StyledDataLine>Commission: 2%</StyledDataLine>
          </StyledTotalSection>
        )}
        <Box>
          <StyledDataLine>
            Total to pay:{" "}
            {usFormattedNumber(
              Math.floor(+watchedAmount * 1.02 * 100) / 100,
              language
            )}
          </StyledDataLine>
          <StyledFormButton
            variant="outlined"
            type="submit"
            disabled={!selectedAccount?.balance || formSubmiting}
          >
            {formSubmiting ? (
              <CircularProgress
                size="1rem"
                color="inherit"
                sx={{ mr: "16px" }}
              />
            ) : null}
            {tate(t, "sendButton")}
          </StyledFormButton>
        </Box>
      </StyledCardsStack>
    </StyledForm>
  );
};

const StyledForm = styled("form")({
  width: "65rem",
  height: "100vh",
  padding: "0 2.5rem",
  borderRadius: "0.5rem",
  display: "flex",
  flexDirection: "column",
});

const StyledFormTitle = styled("h1")({
  color: "#13232f",
  fontSize: "2.5rem",
  lineHeight: "4rem",
  margin: "0 0 2rem",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "0.25rem",
});

const StyledFormButton = styled(Button)({
  height: "56px",
  width: "460px",
  borderRadius: "12px",
  borderColor: "transparent",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
  background: "#13232f",

  "&:disabled": {
    border: "1px solid #13232f",
    color: "#526267",
    background: "#fff",
    opacity: "0.5",
  },

  "&:hover": {
    background: "#414f5a",
    borderColor: "#1ab188",
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

  "@media (max-width: 1050px)": {
    margin: "0 0 8px 0",
  },
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
  color: "#fff",
});

const StyledChevronIcon = styled(DoubleArrowIcon)({
  color: "#13232f",
  fontSize: "60px",

  "@media (max-width: 1050px)": {
    transform: "rotate(90deg)",
  },
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

const StyledTotalSection = styled(Box)({
  boxSizing: "border-box",
  borderRadius: "12px",
  width: "460px",
});
const StyledDataLine = styled("h5")({
  margin: "0 0 16px 0",
  fontSize: "24px",

  "@media (max-width: 1050px)": {
    margin: "0 0 8px 0",
  },
});
const StyledCardsStack = styled(Stack)({
  flexDirection: "row",
  marginBottom: "2rem",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "24px",

  "@media (max-width: 1050px)": {
    flexDirection: "column",
    gap: "10px",
  },
});
