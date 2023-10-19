interface IAccount {
  iban: string;
  id: string;
  balance: number;
}

export interface IRootState {
  accounts: Array<IAccount>;
}