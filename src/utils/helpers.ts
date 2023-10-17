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