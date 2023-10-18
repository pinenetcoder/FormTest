import * as yup from 'yup';
import { usFormattedNumber } from '../utils/helpers';

export const onlinePaymentSchema = (selectedAccBalance: number, tate: (t:any, key: string)=>string, t: any, language: string) =>
  yup.object().shape({
    payerAccount: yup.string().required(tate(t, 'requiredField')).trim(),
    amount: yup
      .number()
      .typeError(tate(t, 'amountValidation'))
      .required(tate(t, 'requiredField'))
      .min(0.01, tate(t, "amountMinimum"))
      .max(selectedAccBalance, `${tate(t, 'maxMesagePt1')} ${usFormattedNumber(selectedAccBalance, language) } ${tate(t, 'maxMesagePt2')}`),
    purpose: yup
    .string()
    .required(tate(t, 'requiredField'))
    .min(3, tate(t, 'min3Chars'))
    .max(135, tate(t, 'max135Chars')).trim(),
    payeeAccount: yup
    .string()
    .required(tate(t, 'requiredField'))
    .matches(/^LT\d{18}$/, tate(t, 'ltIBANFormatWorning')),
    payeeName: yup
    .string()
    .required(tate(t, 'requiredField'))
    .max(70, tate(t, 'max75Chars')).trim(),
  });

export default onlinePaymentSchema;
