import { TFunction } from "i18next";

export const usFormattedNumber = (number: number, currentLanguage: string) => {
  if (currentLanguage === "en") {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return number
      .toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      .replace(",", " ")
      .replace(".", ",");
  }
};

export const accountValidityChecker = async (account: string): Promise<boolean> => {
  const resp = await fetch(`https://matavi.eu/validate/?iban=${account}`);
  const data = await resp.json();
  return data.valid
}


export const checkLTIBANMatch = (inputString: string) => {
  const pattern = /^LT\d{18}$/;
  return pattern.test(inputString);
};


export const tate = (t: TFunction<"translation", undefined>, key: string) => {
  return t(`translations:${key}`)
}


export const currencyIconSelector = (acc: any) => {
  if (acc) {
    switch (acc.currency) {
      case "eur":
        return "€";
      case "usd":
        return "$";
      case "chf":
        return "₣";
      default:
        return "€";
    }
  }
};