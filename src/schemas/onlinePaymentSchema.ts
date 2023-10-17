import * as yup from 'yup';

export const onlinePaymentSchema = (selectedAccBalance: number) =>
  yup.object().shape({
    payerAccount: yup.string().required('This field is required').trim(),
    amount: yup
      .number()
      .typeError('Please enter an amount number')
      .required('This field is required')
      .min(0.01, 'Minimum value should be 0.01 or more')
      .max(selectedAccBalance, `Maximum value should be ${selectedAccBalance} or less`),
    purpose: yup
    .string()
    .required('This field is required')
    .min(3, 'Minimum length should be 3 characters or more')
    .max(135, 'Maximum length should be 135 characters or less').trim(),
    payeeAccount: yup
    .string()
    .required('This field is required')
    .matches(/^LT\d{18}$/, "Please follow the format LT followed by 18 digits."),
    payeeName: yup
    .string()
    .required('This field is required')
    .max(70, 'Maximum length should be 70 characters or less').trim(),
  });

export default onlinePaymentSchema;
